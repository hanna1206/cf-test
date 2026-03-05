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
import { moveFieldInTree } from '@/modules/form-builder/utils/move-field-in-tree';
import { updateFieldInTree } from '@/modules/form-builder/utils/update-field-in-tree';

export const useFormBuilder = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = (type: FieldType, parentId: string | null = null) => {
    const newField = createField(type);
    setFields((prev) => addFieldToTree(prev, newField, parentId));
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

  const exportConfig = (): string => {
    const config: FormConfig = { fields };
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (json: string) => {
    const config = JSON.parse(json) as FormConfig;
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
    exportConfig,
    importConfig,
  };
};
