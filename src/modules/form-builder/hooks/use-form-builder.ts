import { useState } from 'react';

import type {
  Field,
  FieldType,
  FieldUpdate,
  FormConfig,
} from '@/modules/form-builder/form-builder.types';
import { addFieldToTree } from '@/modules/form-builder/utils/add-field-to-tree';
import { createField } from '@/modules/form-builder/utils/create-field';
import { deleteFieldFromTree } from '@/modules/form-builder/utils/delete-field-from-tree';
import { demoteFieldInTree } from '@/modules/form-builder/utils/demote-field-in-tree';
import { moveFieldInTree } from '@/modules/form-builder/utils/move-field-in-tree';
import { promoteFieldInTree } from '@/modules/form-builder/utils/promote-field-in-tree';
import { updateFieldInTree } from '@/modules/form-builder/utils/update-field-in-tree';
import { validateConfig } from '@/modules/form-builder/utils/validate-config';

export const useFormBuilder = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = (type: FieldType, parentId: string | null = null) => {
    const newField = createField(type);
    setFields((prev) => addFieldToTree(prev, newField, parentId));
    setSelectedFieldId(newField.id);
  };

  const deleteField = (id: string) => {
    setFields((prev) => deleteFieldFromTree(prev, id));
    setSelectedFieldId((prev) => (prev === id ? null : prev));
  };

  const updateField = (id: string, patch: FieldUpdate) => {
    setFields((prev) => updateFieldInTree(prev, id, patch));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    setFields((prev) => moveFieldInTree(prev, id, direction));
  };

  const promoteField = (id: string) => {
    setFields((prev) => promoteFieldInTree(prev, id));
  };

  const demoteField = (id: string, targetGroupId: string) => {
    setFields((prev) => demoteFieldInTree(prev, id, targetGroupId));
  };

  const exportConfig = (): string => {
    const config: FormConfig = { fields };
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (json: string) => {
    const parsed = JSON.parse(json) as unknown;
    const config = validateConfig(parsed);
    setFields(config.fields);
    setSelectedFieldId(null);
  };

  return {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    addField,
    deleteField,
    updateField,
    moveField,
    promoteField,
    demoteField,
    exportConfig,
    importConfig,
  };
};
