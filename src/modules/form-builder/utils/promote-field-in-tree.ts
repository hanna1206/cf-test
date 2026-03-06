import type { Field } from '@/modules/form-builder/form-builder.types';

const promoteInArray = (fields: Field[], id: string): [Field[], boolean] => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.type !== 'group') continue;

    const childIdx = field.children.findIndex((c) => c.id === id);
    if (childIdx !== -1) {
      const promoted = field.children[childIdx];
      const newChildren = field.children.filter((c) => c.id !== id);
      const result = [...fields];
      result[i] = { ...field, children: newChildren };
      result.splice(i + 1, 0, promoted);
      return [result, true];
    }

    const [newChildren, found] = promoteInArray(field.children, id);
    if (found) {
      const result = [...fields];
      result[i] = { ...field, children: newChildren };
      return [result, true];
    }
  }

  return [fields, false];
};

export const promoteFieldInTree = (fields: Field[], id: string): Field[] => {
  const [result] = promoteInArray(fields, id);
  return result;
};
