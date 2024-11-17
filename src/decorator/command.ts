import { CMD_IDENTIFIER } from '../types';

export function command({
  identifier,
  handler,
  register,
}: {
  identifier: CMD_IDENTIFIER;
  handler: (params?: any) => any;
  register?: boolean;
}) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      _identifier = identifier;
      _handler = handler;
      _register = register;
    };
  };
}
