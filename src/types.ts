import { ACTION, FEATURE, MODIFIER } from './enums';

export type CMD_NAME = `${ACTION}.${FEATURE}` | `${ACTION}.${FEATURE}.${MODIFIER}`;
