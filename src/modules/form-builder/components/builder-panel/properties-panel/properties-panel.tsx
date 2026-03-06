import { FIELD_TYPE_LABELS } from '@/modules/form-builder/form-builder.const';
import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';
import type { NumberField } from '@/modules/form-builder/form-builder.types';
import { findField } from '@/modules/form-builder/utils/find-field';

import styles from './properties-panel.module.css';

export const PropertiesPanel = () => {
  const { fields, selectedFieldId, updateField } = useFormBuilderContext();

  if (!selectedFieldId) {
    return (
      <p className={styles.placeholder}>
        Select a field to edit its properties
      </p>
    );
  }

  const field = findField(fields, selectedFieldId);
  if (!field) return null;

  const numField = field.type === 'number' ? (field as NumberField) : null;

  return (
    <div className={styles.properties}>
      <p className={styles.propTitle}>{FIELD_TYPE_LABELS[field.type]} field</p>

      <div className={styles.propRow}>
        <label className={styles.propLabel} htmlFor="prop-label">
          Label
        </label>
        <input
          className={styles.propInput}
          id="prop-label"
          type="text"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
      </div>

      {field.type !== 'group' && (
        <div className={styles.propRow}>
          <label className={styles.propLabel} htmlFor="prop-required">
            Required
          </label>
          <input
            id="prop-required"
            type="checkbox"
            checked={field.required}
            onChange={(e) =>
              updateField(field.id, { required: e.target.checked })
            }
          />
        </div>
      )}

      {numField && (
        <>
          <div className={styles.propRow}>
            <label className={styles.propLabel} htmlFor="prop-min">
              Min
            </label>
            <input
              className={styles.propInput}
              id="prop-min"
              type="number"
              value={numField.min ?? ''}
              onChange={(e) =>
                updateField(field.id, {
                  min: Number.isNaN(e.target.valueAsNumber)
                    ? undefined
                    : e.target.valueAsNumber,
                })
              }
            />
          </div>
          <div className={styles.propRow}>
            <label className={styles.propLabel} htmlFor="prop-max">
              Max
            </label>
            <input
              className={styles.propInput}
              id="prop-max"
              type="number"
              value={numField.max ?? ''}
              onChange={(e) =>
                updateField(field.id, {
                  max: Number.isNaN(e.target.valueAsNumber)
                    ? undefined
                    : e.target.valueAsNumber,
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
