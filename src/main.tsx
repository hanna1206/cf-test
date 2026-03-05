import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { FormBuilder } from '@/modules/form-builder/components/form-builder';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FormBuilder />
  </StrictMode>,
);
