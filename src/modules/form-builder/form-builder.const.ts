import type { FieldType } from '@/modules/form-builder/form-builder.types';

export const MAX_NESTING_DEPTH = 5;

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  group: 'Group',
};
