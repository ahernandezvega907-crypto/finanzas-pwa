import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiGuru: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const { categoriesQuery } = useCategories();
  const categories = categoriesQuery?.data || [];

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '¡Hola! Soy AiGuru, tu asesor financiero personal. Puedo analizar tu balance, gastos por categoría o darte recomendaciones de ahorro. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Resumen del estado financiero para las respuestas inteligentes
  const financialSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((tx: any) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        income += amt;
      } else if (tx.type === 'expense') {
        expense += amt;
        const catId = tx.category_id || tx.categoryId;
        const catObj = categories.find((c: any) => c.id === catId);
        const catName = catObj ? catObj.name : 'Otros';
        catMap[catName] = (catMap[catName] || 0) + amt;
      }
    });

    const balance = income - expense;
    let highestExpenseCat = 'Ninguna';
    let maxExpense = 0;

    Object.entries(catMap).forEach(([cat, amt]) => {
      if (amt > maxExpense) {
        maxExpense = amt;
        highestExpenseCat = cat;
      }
    });

    return { income, expense, balance, highestExpenseCat, maxExpense };
  }, [transactions, categories]);

  const generateAiResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    const { income, expense, balance, highestExpenseCat, maxExpense } = financialSummary;

    const formatCurr = (num: number) => `₡${num.toLocaleString('es-CR')}`;

    if (q.includes('resumen') || q.includes('estado') || q.includes('balance') || q.includes('cómo voy')) {
      return `📊 **Resumen Financiero:**\n- Ingresos totales: ${formatCurr(income)}\n- Gastos totales: ${formatCurr(expense)}\n- Balance actual: **${formatCurr(balance)}**\n\n${
        balance >= 0
          ? '¡Vas por buen camino! Mantienes un superávit positivo.'
          : '⚠️ Atención: Tus gastos superan tus ingresos actuales. Te sugiero revisar tus presupuestos.'
      }`;
    }

    if (q.includes('ahorro') || q.includes('ahorrar') || q.includes('consejo') || q.includes('recomiendas')) {
      if (highestExpenseCat !== 'Ninguna') {
        return `💡 **Consejo de Ahorro:**\nTu categoría con mayor gasto es **${highestExpenseCat}** con un total de **${formatCurr(maxExpense)}**.\n\nTe recomiendo intentar reducir un 10% a 15% en esta categoría durante el próximo mes. Podrías ahorrar aproximadamente **${formatCurr(Math.round(maxExpense * 0.12))}**.`;
      }
      return '💡 **Consejo de Ahorro:**\nIntenta aplicar la regla 50/30/20: destina el 50% de tus ingresos a necesidades primarias, el 30% a gustos personales y el 20% directamente al ahorro.';
    }

    if (q.includes('gasto') || q.includes('mayor gasto') || q.includes('categoría')) {
      if (highestExpenseCat !== 'Ninguna') {
        return `💸 Tu categoría con mayor gasto registrado es **${highestExpenseCat}**, sumando **${formatCurr(maxExpense)}**.`;
      }
      return 'Aún no registras gastos suficientes para determinar tu mayor categoría de consumo.';
    }

    return `Entiendo tu consulta sobre "${userQuery}". Basado en tu registro actual, tienes un balance de ${formatCurr(balance)}. Te sugiero establecer límites de gasto en tus categorías principales para optimizar tus presupuestos.`;
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = input;
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const aiReplyText = generateAiResponse(queryText);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1000);
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        AiGuru - Asistente Financiero
      </Typography>

      {/* Sugerencias Rápidas */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          icon={<LightbulbIcon />}
          label="¿Cómo está mi balance general?"
          onClick={() => handlePromptClick('¿Cómo está mi balance general?')}
          clickable
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<LightbulbIcon />}
          label="¿Cuál es mi mayor gasto?"
          onClick={() => handlePromptClick('¿Cuál es mi mayor gasto?')}
          clickable
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<LightbulbIcon />}
          label="Dame un consejo de ahorro"
          onClick={() => handlePromptClick('Dame un consejo de ahorro')}
          clickable
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Ventana del Chat */}
      <Paper
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxShadow: 1,
          bgcolor: 'background.default',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                  width: 36,
                  height: 36,
                }}
              >
                {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
              </Avatar>

              <Box sx={{ maxWidth: '75%' }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? '#fff' : 'text.primary',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ whitespace: 'pre-line' }}>
                    {msg.text}
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5, textAlign: msg.sender === 'user' ? 'right' : 'left' }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
            </Box>
          ))
        )}

        {isThinking && (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              AiGuru está analizando tus finanzas...
            </Typography>
          </Box>
        )}

        <div ref={chatEndRef} />
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Input para enviar mensajes */}
      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Hazle una pregunta a AiGuru..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="medium"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton type="submit" color="primary" disabled={!input.trim() || isThinking} sx={{ p: 1.5 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AiGuru;