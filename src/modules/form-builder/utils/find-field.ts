import type { Field } from '@/modules/form-builder/form-builder.types';

export const findField = (fields: Field[], id: string): Field | null => {
  for (const f of fields) {
    if (f.id === id) return f;
    if (f.type === 'group') {
      const found = findField(f.children, id);
      if (found) return found;
    }
  }

  return null;
};
