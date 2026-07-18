import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';

export const designSystem = {
  colors,
  spacing,
  radius
};

export type DesignSystem = typeof designSystem;