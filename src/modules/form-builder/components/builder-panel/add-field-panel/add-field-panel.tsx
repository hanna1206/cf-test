import {
  FIELD_TYPE_LABELS,
  MAX_NESTING_DEPTH,
} from '@/modules/form-builder/form-builder.const';
import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';
import type { FieldType } from '@/modules/form-builder/form-builder.types';
import { findField } from '@/modules/form-builder/utils/find-field';
import { findParentField } from '@/modules/form-builder/utils/find-parent-field';
import { getFieldDepth } from '@/modules/form-builder/utils/get-field-depth';

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

  const parentDepth = parentId !== null ? getFieldDepth(fields, parentId) : -1;
  const atMaxDepth = parentId !== null && parentDepth + 1 >= MAX_NESTING_DEPTH;

  return (
    <div className={styles.buttons}>
      {FIELD_TYPES.map((type) => (
        <button
          key={type}
          className={styles.button}
          type="button"
          disabled={atMaxDepth}
          onClick={() => addField(type, parentId)}
        >
          + {FIELD_TYPE_LABELS[type]}
        </button>
      ))}
      {atMaxDepth ? (
        <span className={styles.warning}>
          Max nesting depth ({MAX_NESTING_DEPTH}) reached
        </span>
      ) : (
        parentId && (
          <span className={styles.hint}>→ inside «{parentLabel}»</span>
        )
      )}
    </div>
  );
};
