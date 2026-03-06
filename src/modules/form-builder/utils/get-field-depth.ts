import type { Field } from '@/modules/form-builder/form-builder.types';

export const getFieldDepth = (
  fields: Field[],
  id: string,
  depth = 0,
): number => {
  for (const field of fields) {
    if (field.id === id) return depth;
    if (field.type === 'group') {
      const found = getFieldDepth(field.children, id, depth + 1);
      if (found !== -1) return found;
    }
  }
  return -1;
};
