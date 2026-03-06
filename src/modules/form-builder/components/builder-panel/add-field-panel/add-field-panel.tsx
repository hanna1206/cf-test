import { FIELD_TYPE_LABELS } from '@/modules/form-builder/form-builder.const';
import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';
import type { FieldType } from '@/modules/form-builder/form-builder.types';
import { findField } from '@/modules/form-builder/utils/find-field';
import { findParentField } from '@/modules/form-builder/utils/find-parent-field';

import styles from './add-field-panel.module.css';

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as FieldType[];

export const AddFieldPanel = () => {
  const { fields, selectedFieldId, addField } = useFormBuilderContext();

  const selectedField = selectedFieldId
    ? findField(fields, selectedFieldId)
    : null;

  let parentId: string | null = null;
  let parentLabel: string | null = null;

  if (selectedField?.type === 'group') {
    parentId = selectedField.id;
    parentLabel = selectedField.label;
  } else if (selectedField) {
    const parentGroup = findParentField(fields, selectedField.id);
    if (parentGroup) {
      parentId = parentGroup.id;
      parentLabel = parentGroup.label;
    }
  }

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
        <span className={styles.hint}>→ inside «{parentLabel}»</span>
      )}
    </div>
  );
};
