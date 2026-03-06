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
  const withoutField = deleteFieldFromTree(fields, id);

  return addFieldToTree(withoutField, field, targetGroupId);
};
