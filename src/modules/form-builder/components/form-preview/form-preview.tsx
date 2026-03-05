import styles from './form-preview.module.css';

export const FormPreview = () => {
  return (
    <section className={styles.preview}>
      <h2 className={styles.heading}>Live Preview</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <p className={styles.empty}>
          Add fields in the builder to see them here.
        </p>
        <button className={styles.submit} type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};
