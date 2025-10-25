import type { BiomeConfig } from '../types.ts';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const mergeArrays = (a: unknown[], b: unknown[]): unknown[] => {
  const result = [...a];
  for (const item of b) {
    if (!result.some(existing => deepEqual(existing, item))) {
      result.push(item);
    }
  }
  return result;
};

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every(key => deepEqual(a[key], b[key]));
  }
  return false;
};

const deepMerge = (target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> => {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    if (Array.isArray(value)) {
      if (Array.isArray(current)) {
        target[key] = mergeArrays(current, value);
      } else {
        target[key] = [...value];
      }
      continue;
    }

    if (isPlainObject(value)) {
      const nextTarget = isPlainObject(current) ? { ...current } : {};
      target[key] = deepMerge(nextTarget, value);
      continue;
    }

    target[key] = value;
  }
  return target;
};

export const mergeConfigs = <T extends BiomeConfig[]>(...configs: T): BiomeConfig => {
  const merged = configs.reduce<Record<string, unknown>>((accumulator, config) => {
    return deepMerge(accumulator, config as Record<string, unknown>);
  }, {});
  return merged as BiomeConfig;
};
