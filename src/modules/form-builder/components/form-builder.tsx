import { BuilderPanel } from '@/modules/form-builder/components/builder-panel/builder-panel';
import { FormPreview } from '@/modules/form-builder/components/form-preview/form-preview';
import { FormBuilderToolbar } from '@/modules/form-builder/components/toolbar/form-builder-toolbar';
import { FormBuilderProvider } from '@/modules/form-builder/form-builder.context';

import styles from './form-builder.module.css';

export const FormBuilder = () => (
  <FormBuilderProvider>
    <div className={styles.root}>
      <FormBuilderToolbar />
      <div className={styles.body}>
        <BuilderPanel />
        <FormPreview />
      </div>
    </div>
  </FormBuilderProvider>
);
