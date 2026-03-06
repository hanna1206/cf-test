import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';
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
  parentId?: string | null;
  prevSibling?: Field | null;
  nextSibling?: Field | null;
}

export const FieldTreeItem = ({
  field,
  depth = 0,
  parentId = null,
  prevSibling = null,
  nextSibling = null,
}: FieldTreeItemProps) => {
  const {
    selectedFieldId,
    setSelectedFieldId,
    deleteField,
    moveField,
    promoteField,
    demoteField,
  } = useFormBuilderContext();

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
          {field.type !== 'group' && field.required && (
            <span className={styles.requiredBadge}>*</span>
          )}
        </button>

        <div className={styles.treeItemActions}>
          {parentId && (
            <button
              className={styles.actionBtn}
              type="button"
              aria-label={`Move ${field.label} out of group`}
              title="Move out of group"
              onClick={() => promoteField(field.id)}
            >
              ↩
            </button>
          )}
          {prevSibling?.type === 'group' && depth + 1 < MAX_NESTING_DEPTH && (
            <button
              className={styles.actionBtn}
              type="button"
              aria-label={`Move ${field.label} into group above`}
              title="Move into group above"
              onClick={() => demoteField(field.id, prevSibling.id)}
            >
              ⤴
            </button>
          )}
          {nextSibling?.type === 'group' && depth + 1 < MAX_NESTING_DEPTH && (
            <button
              className={styles.actionBtn}
              type="button"
              aria-label={`Move ${field.label} into group below`}
              title="Move into group below"
              onClick={() => demoteField(field.id, nextSibling.id)}
            >
              ⤵
            </button>
          )}
          {prevSibling && (
            <button
              className={styles.actionBtn}
              type="button"
              aria-label={`Move ${field.label} up`}
              title="Move up"
              onClick={() => moveField(field.id, 'up')}
            >
              ↑
            </button>
          )}
          {nextSibling && (
            <button
              className={styles.actionBtn}
              type="button"
              aria-label={`Move ${field.label} down`}
              title="Move down"
              onClick={() => moveField(field.id, 'down')}
            >
              ↓
            </button>
          )}
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
            type="button"
            aria-label={`Delete ${field.label}`}
            title="Delete"
            onClick={() => deleteField(field.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {field.type === 'group' && field.children.length > 0 && (
        <div>
          {field.children.map((child, idx) => (
            <FieldTreeItem
              key={child.id}
              field={child}
              depth={depth + 1}
              parentId={field.id}
              prevSibling={field.children[idx - 1] ?? null}
              nextSibling={field.children[idx + 1] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
};
