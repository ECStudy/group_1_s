import { ACTION, FEATURE, MODIFIER } from './enums';

export type CMD_IDENTIFIER = `${ACTION}.${FEATURE}` | `${ACTION}.${FEATURE}.${MODIFIER}`;
