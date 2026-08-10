// src/foundation/shadows.ts
import { Shadows } from '@mui/material/styles';

// En modo Premium Dark usamos elevaciones sutiles basadas en opacidad sobre el fondo
const baseShadows = Array(25).fill('none') as Shadows;
baseShadows[1] = '0px 2px 4px rgba(0, 0, 0, 0.4)';  // Surface
baseShadows[2] = '0px 4px 12px rgba(0, 0, 0, 0.6)'; // Cards
baseShadows[3] = '0px 8px 24px rgba(0, 0, 0, 0.7)'; // Dialogs
baseShadows[4] = '0px 16px 40px rgba(0, 0, 0, 0.8)'; // Modals/Snackbars

export const shadows = baseShadows;