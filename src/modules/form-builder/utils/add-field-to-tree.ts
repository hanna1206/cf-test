import type { Field } from '@/modules/form-builder/form-builder.types';

export const addFieldToTree = (
  fields: Field[],
  newField: Field,
  parentId: string | null,
): Field[] => {
  if (parentId === null) {
    return [...fields, newField];
  }

  return fields.map((field) => {
    if (field.type !== 'group') return field;
    if (field.id === parentId) {
      return { ...field, children: [...field.children, newField] };
    }
    return {
      ...field,
      children: addFieldToTree(field.children, newField, parentId),
    };
  });
};
