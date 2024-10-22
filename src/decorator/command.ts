import { CMD_IDENTIFIER } from '../types';

export function command({ identifier }: { identifier: CMD_IDENTIFIER }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      _identifier = identifier;
    };
  };
}
