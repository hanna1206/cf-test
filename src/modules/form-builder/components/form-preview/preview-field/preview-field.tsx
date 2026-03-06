import { useState } from 'react';

import type { Field } from '@/modules/form-builder/form-builder.types';

import styles from './preview-field.module.css';

export interface PreviewFieldProps {
  field: Field;
  submitted?: boolean;
}

export const PreviewField = ({
  field,
  submitted = false,
}: PreviewFieldProps) => {
  const id = `preview-${field.id}`;
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const requiredError =
    (submitted || touched) &&
    field.type !== 'group' &&
    field.required &&
    value.trim() === '';

  const rangeError = (() => {
    if (field.type !== 'number' || value.trim() === '') return null;
    const num = Number(value);
    if (field.min !== undefined && num < field.min)
      return `${field.label} must be ≥ ${field.min}`;
    if (field.max !== undefined && num > field.max)
      return `${field.label} must be ≤ ${field.max}`;
    return null;
  })();

  const errorMsg = requiredError
    ? `${field.label} is required`
    : ((submitted || touched) && rangeError) || null;

  const showError = Boolean(errorMsg);

  if (field.type === 'group') {
    return (
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{field.label}</legend>
        {field.children.length === 0 ? (
          <p className={styles.groupEmpty}>No fields in this group yet.</p>
        ) : (
          field.children.map((child) => (
            <PreviewField key={child.id} field={child} submitted={submitted} />
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
        className={`${styles.input} ${showError ? styles.inputError : ''}`}
        id={id}
        type={field.type}
        value={value}
        required={field.required}
        min={field.type === 'number' ? field.min : undefined}
        max={field.type === 'number' ? field.max : undefined}
        placeholder={field.label}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {showError && <span className={styles.errorMsg}>{errorMsg}</span>}
    </div>
  );
};
