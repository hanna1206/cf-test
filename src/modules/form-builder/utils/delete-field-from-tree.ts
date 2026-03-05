import type { Field } from '@/modules/form-builder/form-builder.types';

export const deleteFieldFromTree = (fields: Field[], id: string): Field[] => {
  return fields
    .filter((f) => f.id !== id)
    .map((field) => {
      if (field.type !== 'group') return field;
      return { ...field, children: deleteFieldFromTree(field.children, id) };
    });
};
