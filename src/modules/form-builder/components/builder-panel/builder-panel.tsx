import styles from './builder-panel.module.css';

export const BuilderPanel = () => {
  return (
    <aside className={styles.panel}>
      <section className={styles.palette}>
        <p className={styles.placeholder}>Add Field palette</p>
      </section>

      <section className={styles.treeArea}>
        <p className={styles.placeholder}>Field Tree</p>
      </section>

      <section className={styles.propertiesArea}>
        <p className={styles.placeholder}>Properties Panel</p>
      </section>
    </aside>
  );
};
