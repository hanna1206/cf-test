import { FIELD_TYPE_LABELS } from '@/modules/form-builder/form-builder.const';
import type {
  Field,
  FieldType,
} from '@/modules/form-builder/form-builder.types';

export const createField = (type: FieldType): Field => {
  const base = {
    id: crypto.randomUUID(),
    label: `New ${FIELD_TYPE_LABELS[type]} Field`,
  };

  switch (type) {
    case 'text':
      return { ...base, type: 'text', required: false };
    case 'number':
      return { ...base, type: 'number', required: false };
    case 'group':
      return { ...base, type: 'group', children: [] };
  }
};
