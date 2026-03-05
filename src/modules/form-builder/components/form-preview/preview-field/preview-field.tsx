import type { Field } from '@/modules/form-builder/form-builder.types';

import styles from './preview-field.module.css';

export interface PreviewFieldProps {
  field: Field;
}

export const PreviewField = ({ field }: PreviewFieldProps) => {
  const id = `preview-${field.id}`;

  if (field.type === 'group') {
    return (
      <fieldset className={styles.group}>
        <legend className={styles.legend}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </legend>
        {field.children.length === 0 ? (
          <p className={styles.groupEmpty}>No fields in this group yet.</p>
        ) : (
          field.children.map((child) => (
            <PreviewField key={child.id} field={child} />
          ))
        )}
      </fieldset>
    );
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        id={id}
        type={field.type}
        required={field.required}
        min={field.type === 'number' ? field.min : undefined}
        max={field.type === 'number' ? field.max : undefined}
        placeholder={field.label}
      />
    </div>
  );
};
