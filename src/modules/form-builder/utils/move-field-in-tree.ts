import type { Field } from '@/modules/form-builder/form-builder.types';

export const moveFieldInTree = (
  fields: Field[],
  id: string,
  direction: 'up' | 'down',
): Field[] => {
  const idx = fields.findIndex((f) => f.id === id);

  if (idx !== -1) {
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= fields.length) return fields;
    const result = [...fields];
    [result[idx], result[swapIdx]] = [result[swapIdx], result[idx]];
    return result;
  }

  return fields.map((field) => {
    if (field.type !== 'group') return field;
    return {
      ...field,
      children: moveFieldInTree(field.children, id, direction),
    };
  });
};
