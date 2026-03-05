import { BuilderPanel } from './builder-panel/builder-panel';
import { FormPreview } from './form-preview/form-preview';
import { FormBuilderToolbar } from './toolbar/form-builder-toolbar';

import styles from './form-builder.module.css';

export const FormBuilder = () => {
  return (
    <div className={styles.root}>
      <FormBuilderToolbar />
      <div className={styles.body}>
        <BuilderPanel />
        <FormPreview />
      </div>
    </div>
  );
};
