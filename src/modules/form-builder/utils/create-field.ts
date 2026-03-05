import { FIELD_TYPE_LABELS } from '@/modules/form-builder/form-builder.const';
import type {
  Field,
  FieldType,
} from '@/modules/form-builder/form-builder.types';

export const createField = (type: FieldType): Field => {
  const base = {
    id: crypto.randomUUID(),
    label: `New ${FIELD_TYPE_LABELS[type]} Field`,
    required: false,
  };

  switch (type) {
    case 'text':
      return { ...base, type: 'text' };
    case 'number':
      return { ...base, type: 'number' };
    case 'group':
      return { ...base, type: 'group', children: [] };
  }
};
