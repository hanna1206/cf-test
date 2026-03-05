import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';
import type {
  Field,
  FieldType,
} from '@/modules/form-builder/form-builder.types';

import styles from './field-tree-item.module.css';

const TYPE_BADGE_CLASS: Record<FieldType, keyof typeof styles> = {
  text: 'typeText',
  number: 'typeNumber',
  group: 'typeGroup',
};

export interface FieldTreeItemProps {
  field: Field;
  depth?: number;
}

export const FieldTreeItem = ({ field, depth = 0 }: FieldTreeItemProps) => {
  const { selectedFieldId, setSelectedFieldId, deleteField, moveField } =
    useFormBuilderContext();

  const isSelected = selectedFieldId === field.id;

  return (
    <div className={styles.treeItem}>
      <div
        className={`${styles.treeItemRow} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${0.75 + depth * 1.25}rem` }}
      >
        <button
          className={styles.treeItemLabel}
          type="button"
          onClick={() => setSelectedFieldId(isSelected ? null : field.id)}
        >
          <span
            className={`${styles.typeBadge} ${styles[TYPE_BADGE_CLASS[field.type]]}`}
          >
            {field.type}
          </span>
          <span className={styles.treeItemText}>{field.label}</span>
          {field.required && <span className={styles.requiredBadge}>*</span>}
        </button>

        <div className={styles.treeItemActions}>
          <button
            className={styles.actionBtn}
            type="button"
            title="Move up"
            onClick={() => moveField(field.id, 'up')}
          >
            ↑
          </button>
          <button
            className={styles.actionBtn}
            type="button"
            title="Move down"
            onClick={() => moveField(field.id, 'down')}
          >
            ↓
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
            type="button"
            title="Delete"
            onClick={() => deleteField(field.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {field.type === 'group' && field.children.length > 0 && (
        <div>
          {field.children.map((child) => (
            <FieldTreeItem key={child.id} field={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
