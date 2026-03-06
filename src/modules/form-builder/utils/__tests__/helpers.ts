import type {
  GroupField,
  NumberField,
  TextField,
} from '@/modules/form-builder/form-builder.types';

export const makeText = (overrides?: Partial<TextField>): TextField => ({
  id: 'text-field',
  type: 'text',
  label: 'Text Field',
  required: false,
  ...overrides,
});

export const makeNumber = (overrides?: Partial<NumberField>): NumberField => ({
  id: 'number-field',
  type: 'number',
  label: 'Number Field',
  required: false,
  ...overrides,
});

export const makeGroup = (overrides?: Partial<GroupField>): GroupField => ({
  id: 'group-field',
  type: 'group',
  label: 'Group Field',
  children: [],
  ...overrides,
});
