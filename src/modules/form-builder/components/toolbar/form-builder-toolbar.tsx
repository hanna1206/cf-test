import styles from './form-builder-toolbar.module.css';

export const FormBuilderToolbar = () => {
  return (
    <header className={styles.toolbar}>
      <span className={styles.title}>Configurable Form Builder</span>
      <div className={styles.actions}>
        <button className={styles.button} disabled type="button">
          Export JSON
        </button>
        <button className={styles.button} disabled type="button">
          Import JSON
        </button>
      </div>
    </header>
  );
};
