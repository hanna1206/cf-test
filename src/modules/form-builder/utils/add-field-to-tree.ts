import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';
import type { Field } from '@/modules/form-builder/form-builder.types';

const insertIntoTree = (
  fields: Field[],
  newField: Field,
  parentId: string,
  depth: number,
): Field[] =>
  fields.map((field) => {
    if (field.type !== 'group') return field;
    if (field.id === parentId) {
      // children would be at depth + 1; refuse if that exceeds the limit
      if (depth + 1 >= MAX_NESTING_DEPTH) return field;
      return { ...field, children: [...field.children, newField] };
    }
    return {
      ...field,
      children: insertIntoTree(field.children, newField, parentId, depth + 1),
    };
  });

export const addFieldToTree = (
  fields: Field[],
  newField: Field,
  parentId: string | null,
): Field[] => {
  if (parentId === null) {
    return [...fields, newField];
  }
  return insertIntoTree(fields, newField, parentId, 0);
};
