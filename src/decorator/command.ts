import { CMD_IDENTIFIER } from '../types';

export function command({ identifier, handler }: { identifier: CMD_IDENTIFIER; handler: (params?: any) => any }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      _identifier = identifier;
      _handler = handler;
    };
  };
}
