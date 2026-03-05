import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';

import { PreviewField } from './preview-field/preview-field';

import styles from './form-preview.module.css';

export const FormPreview = () => {
  const { fields } = useFormBuilderContext();

  return (
    <section className={styles.preview}>
      <h2 className={styles.heading}>Live Preview</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {fields.length === 0 ? (
          <p className={styles.empty}>
            Add fields in the builder to see them here.
          </p>
        ) : (
          fields.map((field) => <PreviewField key={field.id} field={field} />)
        )}
        <button className={styles.submit} type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};
