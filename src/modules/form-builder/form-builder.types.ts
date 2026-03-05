export type FieldType = 'text' | 'number' | 'group';

interface BaseField {
  id: string;
  label: string;
  required: boolean;
}

export interface TextField extends BaseField {
  type: 'text';
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface GroupField extends BaseField {
  type: 'group';
  children: Field[];
}

export type Field = TextField | NumberField | GroupField;

export interface FormConfig {
  fields: Field[];
}
