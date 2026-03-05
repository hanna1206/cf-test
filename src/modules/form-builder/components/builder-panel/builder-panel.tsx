import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';

import { AddFieldPanel } from './add-field-panel/add-field-panel';
import { FieldTreeItem } from './field-tree-item/field-tree-item';
import { PropertiesPanel } from './properties-panel/properties-panel';

import styles from './builder-panel.module.css';

export const BuilderPanel = () => {
  const { fields } = useFormBuilderContext();

  return (
    <aside className={styles.panel}>
      <section className={styles.palette}>
        <AddFieldPanel />
      </section>

      <section className={styles.treeArea}>
        {fields.length === 0 ? (
          <p className={styles.placeholder}>
            No fields yet. Add one from the palette above.
          </p>
        ) : (
          fields.map((field) => <FieldTreeItem key={field.id} field={field} />)
        )}
      </section>

      <section className={styles.propertiesArea}>
        <PropertiesPanel />
      </section>
    </aside>
  );
};
