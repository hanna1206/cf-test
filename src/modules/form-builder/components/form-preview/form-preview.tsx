import { useRef, useState } from 'react';

import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';

import { PreviewField } from './preview-field/preview-field';

import styles from './form-preview.module.css';

export const FormPreview = () => {
  const { fields } = useFormBuilderContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [prevFields, setPrevFields] = useState(fields);

  // Reset validation state when fields structure changes
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (prevFields !== fields) {
    setPrevFields(fields);
    setSubmitted(false);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (formRef.current?.checkValidity()) {
      alert('Form is valid!');
      setSubmitted(false);
    }
  };

  return (
    <section className={styles.preview}>
      <h2 className={styles.heading}>Live Preview</h2>
      <form
        ref={formRef}
        className={styles.form}
        noValidate
        onSubmit={handleSubmit}
      >
        {fields.length === 0 ? (
          <p className={styles.empty}>
            Add fields in the builder to see them here.
          </p>
        ) : (
          fields.map((field) => (
            <PreviewField key={field.id} field={field} submitted={submitted} />
          ))
        )}
        <button className={styles.submit} type="submit">
          Validate / Submit
        </button>
      </form>
    </section>
  );
};
