import { createField } from '../create-field';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('createField', () => {
  it('creates a text field with defaults', () => {
    const result = createField('text');

    expect(result.id).toMatch(UUID_PATTERN);
    expect(result.type).toBe('text');
    expect(result.label).toBe('New Text Field');
    expect((result as { required: boolean }).required).toBe(false);
  });

  it('creates a number field with defaults', () => {
    const result = createField('number');

    expect(result.id).toMatch(UUID_PATTERN);
    expect(result.type).toBe('number');
    expect(result.label).toBe('New Number Field');
    expect((result as { required: boolean }).required).toBe(false);
  });

  it('creates a group field with defaults', () => {
    const result = createField('group');

    expect(result.id).toMatch(UUID_PATTERN);
    expect(result.type).toBe('group');
    expect(result.label).toBe('New Group Field');
    expect((result as { children: unknown[] }).children).toEqual([]);
  });

  it('assigns a unique id for each field created', () => {
    const first = createField('text');
    const second = createField('text');

    expect(first.id).not.toBe(second.id);
  });

  it('does not set min or max on a number field', () => {
    const result = createField('number') as { min?: unknown; max?: unknown };

    expect(result.min).toBeUndefined();
    expect(result.max).toBeUndefined();
  });

  it('gives each group field an independent children array', () => {
    const first = createField('group') as { children: unknown[] };
    const second = createField('group') as { children: unknown[] };

    expect(first.children).not.toBe(second.children);
  });
});
