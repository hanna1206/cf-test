import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';

import { validateConfig } from '../validate-config';

const validText = () => ({
  id: 'f1',
  label: 'Name',
  type: 'text',
  required: true,
});
const validNumber = () => ({
  id: 'f2',
  label: 'Age',
  type: 'number',
  required: false,
});
const validGroup = (children: unknown[] = []) => ({
  id: 'g1',
  label: 'Section',
  type: 'group',
  children,
});

describe('validateConfig – top-level shape', () => {
  it('throws when input is not an object', () => {
    expect(() => validateConfig(null)).toThrow(
      'Invalid config: expected an object',
    );
    expect(() => validateConfig('bad')).toThrow(
      'Invalid config: expected an object',
    );
    expect(() => validateConfig(42)).toThrow(
      'Invalid config: expected an object',
    );
  });

  it('throws when fields is missing or not an array', () => {
    expect(() => validateConfig({})).toThrow('expected { fields: [...] }');
    expect(() => validateConfig({ fields: null })).toThrow(
      'expected { fields: [...] }',
    );
    expect(() => validateConfig({ fields: 'oops' })).toThrow(
      'expected { fields: [...] }',
    );
  });

  it('accepts an empty fields array', () => {
    expect(() => validateConfig({ fields: [] })).not.toThrow();
  });

  it('returns the parsed object typed as FormConfig', () => {
    const input = { fields: [validText()] };
    const result = validateConfig(input);
    expect(result.fields).toHaveLength(1);
  });

  it('throws when an array is passed as the config root', () => {
    expect(() => validateConfig([{ fields: [] }])).toThrow(
      'expected { fields: [...] }',
    );
  });
});

describe('validateConfig – field validation', () => {
  it('throws when a field is not an object', () => {
    expect(() => validateConfig({ fields: ['bad'] })).toThrow(
      'fields[0]: expected an object',
    );
  });

  it('throws for a missing or empty id', () => {
    const noId = { label: 'X', type: 'text', required: false };
    expect(() => validateConfig({ fields: [noId] })).toThrow('fields[0].id');

    const emptyId = { ...noId, id: '   ' };
    expect(() => validateConfig({ fields: [emptyId] })).toThrow('fields[0].id');
  });

  it('throws for a non-string label', () => {
    const noLabel = { id: 'x', type: 'text', required: false, label: 99 };
    expect(() => validateConfig({ fields: [noLabel] })).toThrow(
      'fields[0].label',
    );
  });

  it('throws for an unknown type', () => {
    const badType = { id: 'x', label: 'X', type: 'checkbox', required: false };
    expect(() => validateConfig({ fields: [badType] })).toThrow(
      'fields[0].type',
    );
    expect(() => validateConfig({ fields: [badType] })).toThrow('checkbox');
  });

  it('throws when required is missing on a text/number field', () => {
    const noRequired = { id: 'x', label: 'X', type: 'text' };
    expect(() => validateConfig({ fields: [noRequired] })).toThrow(
      'fields[0].required',
    );
  });

  it('throws when required is a non-boolean value', () => {
    const stringRequired = {
      id: 'x',
      label: 'X',
      type: 'text',
      required: 'yes',
    };
    expect(() => validateConfig({ fields: [stringRequired] })).toThrow(
      'fields[0].required',
    );
    const numRequired = { id: 'x', label: 'X', type: 'number', required: 1 };
    expect(() => validateConfig({ fields: [numRequired] })).toThrow(
      'fields[0].required',
    );
  });

  it('throws when min/max on a number field is not a number', () => {
    const badMin = { ...validNumber(), min: 'low' };
    expect(() => validateConfig({ fields: [badMin] })).toThrow('fields[0].min');

    const badMax = { ...validNumber(), max: true };
    expect(() => validateConfig({ fields: [badMax] })).toThrow('fields[0].max');
  });

  it('allows optional min/max on a number field', () => {
    const withBoth = { ...validNumber(), min: 0, max: 100 };
    expect(() => validateConfig({ fields: [withBoth] })).not.toThrow();

    const withNeither = validNumber();
    expect(() => validateConfig({ fields: [withNeither] })).not.toThrow();
  });

  it('accepts min: 0 and max: 0 as valid numeric values', () => {
    const withZero = { ...validNumber(), min: 0, max: 0 };
    expect(() => validateConfig({ fields: [withZero] })).not.toThrow();
  });

  it('throws when a group is missing children array', () => {
    const noChildren = { id: 'g', label: 'G', type: 'group' };
    expect(() => validateConfig({ fields: [noChildren] })).toThrow(
      'fields[0].children',
    );
  });

  it('validates nested children recursively', () => {
    const badChild = {
      id: 'c',
      label: 'C',
      type: 'text' /* missing required */,
    };
    const group = validGroup([badChild]);
    expect(() => validateConfig({ fields: [group] })).toThrow(
      'fields[0].children[0].required',
    );
  });

  it('accepts a valid group with valid children', () => {
    const group = validGroup([validText(), validNumber()]);
    expect(() => validateConfig({ fields: [group] })).not.toThrow();
  });

  it('reports the correct path for an invalid field beyond index 0', () => {
    const bad = { id: 'x', label: 'X', type: 'text' /* missing required */ };
    expect(() =>
      validateConfig({ fields: [validText(), validNumber(), bad] }),
    ).toThrow('fields[2].required');
  });
});

describe('validateConfig – nesting depth', () => {
  /** Build a config where a group is nested `levels` deep */
  const buildDeepConfig = (levels: number): unknown => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = {
      id: `g-leaf`,
      label: 'leaf',
      type: 'group',
      children: [],
    };
    for (let i = levels - 1; i >= 1; i--) {
      node = {
        id: `g-${i}`,
        label: `Group ${i}`,
        type: 'group',
        children: [node],
      };
    }
    return { fields: [node] };
  };

  it('accepts groups nested exactly at the depth limit boundary', () => {
    // A group at depth 0 whose child is at depth 1 … MAX-1 is fine
    expect(() =>
      validateConfig(buildDeepConfig(MAX_NESTING_DEPTH - 1)),
    ).not.toThrow();
  });

  it('throws when a group exceeds the maximum nesting depth', () => {
    expect(() => validateConfig(buildDeepConfig(MAX_NESTING_DEPTH))).toThrow(
      'exceeds maximum nesting depth',
    );
  });
});
