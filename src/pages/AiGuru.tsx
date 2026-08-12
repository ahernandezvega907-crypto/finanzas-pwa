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
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';
import { supabase } from '../lib/supabase';

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
  const [apiError, setApiError] = useState<string | null>(null);
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

  // Resumen del estado financiero: se envía como contexto a la Edge Function
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

    return {
      totalIncome: income,
      totalExpenses: expense,
      balance,
      highestExpenseCat,
      maxExpense,
    };
  }, [transactions, categories]);

  const askGuru = async (userQuery: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('gemini-advice', {
      body: {
        userPrompt: userQuery,
        context: financialSummary,
      },
    });

    if (error) {
      throw new Error(error.message || 'No se pudo contactar al Gurú IA.');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data?.text || 'No se obtuvo una respuesta del Gurú IA.';
  };

  const handleSend = async (e?: React.FormEvent) => {
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
    setApiError(null);

    try {
      const aiReplyText = await askGuru(queryText);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setApiError(err.message || 'Ocurrió un error al consultar al Gurú IA.');
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        AiGuru - Asistente Financiero
      </Typography>

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
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
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

      {apiError && (
        <Alert severity="error" sx={{ mt: 1.5 }} onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Hazle una pregunta a AiGuru..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="medium"
            disabled={isThinking}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton type="submit" color="primary" disabled={!input.trim() || isThinking} sx={{ p: 1.5 }}>
            <SendIcon />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ display: 'block', fontSize: '0.72rem', opacity: 0.85, mt: 0.5 }}
        >
          🤖 AiGuru es un asistente basado en IA y sus respuestas no constituyen asesoramiento financiero certificado. Verifica la información importante.
        </Typography>
      </Box>
    </Box>
  );
};

export default AiGuru;