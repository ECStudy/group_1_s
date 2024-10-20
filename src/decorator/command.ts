import { CMD_NAME } from '../types';

export function command({ name }: { name: CMD_NAME }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      _name = name;
    };
  };
}
