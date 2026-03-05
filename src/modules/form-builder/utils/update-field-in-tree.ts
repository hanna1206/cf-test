import type {
  Field,
  FieldUpdate,
} from '@/modules/form-builder/form-builder.types';

export const updateFieldInTree = (
  fields: Field[],
  id: string,
  patch: FieldUpdate,
): Field[] => {
  return fields.map((field) => {
    if (field.id === id) {
      return { ...field, ...patch } as Field;
    }
    if (field.type !== 'group') return field;
    return { ...field, children: updateFieldInTree(field.children, id, patch) };
  });
};
