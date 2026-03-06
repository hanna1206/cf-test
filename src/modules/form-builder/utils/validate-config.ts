import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';
import type {
  Field,
  FormConfig,
} from '@/modules/form-builder/form-builder.types';

const VALID_TYPES = new Set(['text', 'number', 'group']);

const validateField = (raw: unknown, depth: number, path: string): Field => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error(`${path}: expected an object`);
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== 'string' || obj.id.trim() === '') {
    throw new Error(`${path}.id: expected a non-empty string`);
  }
  if (typeof obj.label !== 'string') {
    throw new Error(`${path}.label: expected a string`);
  }
  if (typeof obj.required !== 'boolean') {
    throw new Error(`${path}.required: expected a boolean`);
  }
  if (!VALID_TYPES.has(obj.type as string)) {
    throw new Error(
      `${path}.type: expected 'text', 'number', or 'group', got ${JSON.stringify(obj.type)}`,
    );
  }

  const type = obj.type as string;

  if (type === 'number') {
    if (obj.min !== undefined && typeof obj.min !== 'number') {
      throw new Error(`${path}.min: expected a number or undefined`);
    }
    if (obj.max !== undefined && typeof obj.max !== 'number') {
      throw new Error(`${path}.max: expected a number or undefined`);
    }
  }

  if (type === 'group') {
    if (!Array.isArray(obj.children)) {
      throw new Error(`${path}.children: expected an array`);
    }
    if (depth + 1 >= MAX_NESTING_DEPTH) {
      throw new Error(
        `${path}: group exceeds maximum nesting depth of ${MAX_NESTING_DEPTH}`,
      );
    }
    obj.children.forEach((child, i) =>
      validateField(child, depth + 1, `${path}.children[${i}]`),
    );
  }

  return obj as unknown as Field;
};

export const validateConfig = (parsed: unknown): FormConfig => {
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid config: expected an object');
  }

  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj.fields)) {
    throw new Error('Invalid config: expected { fields: [...] }');
  }

  obj.fields.forEach((field, i) => validateField(field, 0, `fields[${i}]`));

  return obj as unknown as FormConfig;
};
