import { test, describe, expect, vi } from 'vitest';
import { toast } from './utils';

describe('utils', () => {
	test('toast', () => {
    const spy = vi.fn(toast)
    expect(()=> spy('hello')).not.toThrow();
		expect(spy).toHaveBeenCalled();
  });
});
