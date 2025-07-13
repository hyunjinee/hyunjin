import { transform } from '@babel/core';
import removeConsolePlugin from './index';

function testPlugin(code: string, options = {}) {
  const result = transform(code, {
    plugins: [[removeConsolePlugin, options]],
    parserOpts: { plugins: ['typescript'] }
  });
  return result?.code;
}

describe('babel-plugin-remove-console', () => {
  it('should remove console.log statements', () => {
    const input = `
console.log('hello');
const a = 1;
console.log('world');
`;
    const output = testPlugin(input);
    expect(output).toBe(`const a = 1;`);
  });

  it('should remove various console methods', () => {
    const input = `
console.log('log');
console.error('error');
console.warn('warn');
console.info('info');
console.debug('debug');
`;
    const output = testPlugin(input);
    expect(output).toBe('');
  });

  it('should handle console in expressions', () => {
    const input = `
const result = console.log('hello');
const value = 1 + console.log('world');
`;
    const output = testPlugin(input);
    expect(output).toContain('const result = void 0;');
    expect(output).toContain('const value = 1 + void 0;');
  });

  it('should respect exclude option', () => {
    const input = `
console.log('remove this');
console.error('keep this');
console.warn('keep this too');
`;
    const output = testPlugin(input, { exclude: ['error', 'warn'] });
    expect(output).not.toContain('console.log');
    expect(output).toContain('console.error');
    expect(output).toContain('console.warn');
  });

  it('should not remove non-console calls', () => {
    const input = `
myConsole.log('keep this');
notConsole.log('keep this');
`;
    const output = testPlugin(input);
    expect(output?.trim()).toBe(`myConsole.log('keep this');
notConsole.log('keep this');`);
  });

  it('should remove all console methods including custom ones', () => {
    const input = `
console.myMethod('remove this');
console.customLog('remove this too');
`;
    const output = testPlugin(input);
    expect(output).toBe('');
  });

  it('should handle nested console calls', () => {
    const input = `
console.log(console.log('nested'));
`;
    const output = testPlugin(input);
    expect(output).toBe('');
  });

  it('should preserve other code', () => {
    const input = `
function test() {
  console.log('remove');
  const x = 10;
  console.error('remove');
  return x;
}
`;
    const output = testPlugin(input);
    expect(output).toContain('function test()');
    expect(output).toContain('const x = 10;');
    expect(output).toContain('return x;');
    expect(output).not.toContain('console');
  });
});