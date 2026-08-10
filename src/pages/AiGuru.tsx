import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { SmartToy as RobotIcon, Send as SendIcon, AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { askAiGuru, FinancialContext } from '../services/ai.service';
import { supabase } from '../lib/supabase';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiGuru: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: '¡Hola! Soy tu Gurú Financiero. He revisado tus movimientos y presupuestos de este mes. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finContext, setFinContext] = useState<FinancialContext | null>(null);

  // Obtener contexto actual
  useEffect(() => {
    async function loadContext() {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString().slice(0, 10);

        const [txRes, bRes] = await Promise.all([
          supabase
            .from('transactions')
            .select('amount, type, category_id, categories(name)')
            .gte('transaction_date', startOfMonth)
            .lte('transaction_date', endOfMonth),
          supabase
            .from('budgets')
            .select('amount_limit, category_id, categories(name)'),
        ]);

        let income = 0;
        let expenses = 0;
        const spentMap: Record<string, number> = {};

        (txRes.data || []).forEach((tx: any) => {
          const amt = Number(tx.amount || 0);
          if (tx.type === 'income') {
            income += amt;
          } else {
            expenses += amt;
            const catName = tx.categories?.name || 'General';
            spentMap[catName] = (spentMap[catName] || 0) + amt;
          }
        });

        const budgetsStatus = (bRes.data || []).map((b: any) => {
          const catName = b.categories?.name || 'Categoría';
          return {
            category: catName,
            limit: Number(b.amount_limit || 0),
            spent: spentMap[catName] || 0,
          };
        });

        setFinContext({
          totalIncome: income,
          totalExpenses: expenses,
          balance: income - expenses,
          budgetsStatus,
        });
      } catch (err) {
        console.error('Error al cargar contexto para IA:', err);
      }
    }

    loadContext();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const reply = await askAiGuru(userMsg, finContext || undefined);

    setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    setLoading(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 850, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <RobotIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Gurú IA Financiero
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Asesoramiento personalizado basado en tus datos reales
          </Typography>
        </Box>
      </Box>

      {/* Sugerencias Rápidas */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          icon={<SparklesIcon />}
          label="¿Cómo voy este mes?"
          onClick={() => handleQuickPrompt('¿Cómo voy este mes? Dame un resumen breve de mis finanzas.')}
          clickable
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<SparklesIcon />}
          label="¿En qué puedo ahorrar?"
          onClick={() => handleQuickPrompt('¿En qué categoría estoy gastando más y cómo puedo recortar gastos?')}
          clickable
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<SparklesIcon />}
          label="Revisar presupuestos"
          onClick={() => handleQuickPrompt('¿Tengo alguna categoría de presupuesto en riesgo de sobrepasarse?')}
          clickable
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Historial de Mensajes */}
      <Paper
        sx={{
          p: 2,
          height: 420,
          overflowY: 'auto',
          borderRadius: 3,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'background.default',
        }}
      >
        {messages.map((msg, index) => {
          const isAi = msg.sender === 'ai';
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: isAi ? 'flex-start' : 'flex-end',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  borderRadius: 3,
                  bgcolor: isAi ? 'background.paper' : 'primary.main',
                  color: isAi ? 'text.primary' : 'primary.contrastText',
                  whiteSpace: 'pre-line',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            </Box>
          );
        })}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="caption" color="text.secondary">
              El Gurú está analizando tus finanzas...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Formulario de Entrada */}
      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Hazle una pregunta a tu Gurú..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          size="medium"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !input.trim()}
          sx={{ px: 3 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default AiGuru;