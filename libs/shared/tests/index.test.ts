import { hello } from '@shared';

describe('hello tests', () => {
  test('should return "Hello, World!"', () => {
    expect(hello('World')).toBe('Hello, World!');
  });
});
