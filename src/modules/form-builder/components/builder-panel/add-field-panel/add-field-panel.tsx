import { FIELD_TYPE_LABELS } from '@/modules/form-builder/form-builder.const';
import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';
import type { FieldType } from '@/modules/form-builder/form-builder.types';
import { findField } from '@/modules/form-builder/utils/find-field';

import styles from './add-field-panel.module.css';

const FIELD_TYPES: FieldType[] = ['text', 'number', 'group'];

export const AddFieldPanel = () => {
  const { fields, selectedFieldId, addField } = useFormBuilderContext();

  const selectedField = selectedFieldId
    ? findField(fields, selectedFieldId)
    : null;
  const parentId = selectedField?.type === 'group' ? selectedField.id : null;

  return (
    <div className={styles.buttons}>
      {FIELD_TYPES.map((type) => (
        <button
          key={type}
          className={styles.button}
          type="button"
          onClick={() => addField(type, parentId)}
        >
          + {FIELD_TYPE_LABELS[type]}
        </button>
      ))}
      {parentId && (
        <span className={styles.hint}>→ inside «{selectedField?.label}»</span>
      )}
    </div>
  );
};
