import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

export const findParentField = (
  fields: Field[],
  id: string,
  parent: GroupField | null = null,
): GroupField | null | undefined => {
  for (const field of fields) {
    if (field.id === id) return parent;
    if (field.type === 'group') {
      const found = findParentField(field.children, id, field);
      if (found !== undefined) return found;
    }
  }

  return undefined;
};
