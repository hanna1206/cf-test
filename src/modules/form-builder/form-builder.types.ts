export type FieldType = 'text' | 'number' | 'group';

export interface BaseField {
  id: string;
  label: string;
  required: boolean;
}

export type FieldUpdate = Partial<Pick<BaseField, 'label' | 'required'>> &
  Partial<Pick<NumberField, 'min' | 'max'>> &
  Partial<Pick<GroupField, 'children'>>;

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
