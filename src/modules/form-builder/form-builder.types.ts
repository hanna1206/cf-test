export type FieldType = 'text' | 'number' | 'group';

export interface BaseField {
  id: string;
  label: string;
}

export type FieldUpdate = Partial<Pick<BaseField, 'label'>> &
  Partial<{ required: boolean }> &
  Partial<Pick<NumberField, 'min' | 'max'>> &
  Partial<Pick<GroupField, 'children'>>;

export interface TextField extends BaseField {
  type: 'text';
  required: boolean;
}

export interface NumberField extends BaseField {
  type: 'number';
  required: boolean;
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
