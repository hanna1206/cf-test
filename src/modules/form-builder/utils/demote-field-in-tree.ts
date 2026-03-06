import type { Field } from '@/modules/form-builder/form-builder.types';

import { addFieldToTree } from './add-field-to-tree';
import { deleteFieldFromTree } from './delete-field-from-tree';
import { findField } from './find-field';

export const demoteFieldInTree = (
  fields: Field[],
  id: string,
  targetGroupId: string,
): Field[] => {
  const field = findField(fields, id);
  if (!field) return fields;
  const targetField = findField(fields, targetGroupId);
  if (!targetField || targetField.type !== 'group') return fields;

  const withoutField = deleteFieldFromTree(fields, id);
  const result = addFieldToTree(withoutField, field, targetGroupId);

  if (!findField(result, id)) return fields;

  return result;
};
