import { useState } from 'react';

import { JsonModal } from '@/modules/form-builder/components/json-modal/json-modal';
import { useFormBuilderContext } from '@/modules/form-builder/form-builder.context';

import styles from './form-builder-toolbar.module.css';

type ModalMode = 'export' | 'import' | null;

export const FormBuilderToolbar = () => {
  const { fields, exportConfig, importConfig } = useFormBuilderContext();
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  return (
    <header className={styles.toolbar}>
      <span className={styles.title}>Configurable Form Builder</span>
      <div className={styles.actions}>
        <button
          className={styles.button}
          type="button"
          disabled={fields.length === 0}
          onClick={() => setModalMode('export')}
        >
          Export JSON
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => setModalMode('import')}
        >
          Import JSON
        </button>
      </div>

      {modalMode === 'export' && (
        <JsonModal
          mode="export"
          json={exportConfig()}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === 'import' && (
        <JsonModal
          mode="import"
          onApply={importConfig}
          onClose={() => setModalMode(null)}
        />
      )}
    </header>
  );
};
