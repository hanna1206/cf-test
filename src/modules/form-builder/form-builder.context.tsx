/* eslint-disable react-refresh/only-export-components */
import { createContext, use } from 'react';
import type { ReactNode } from 'react';

import { useFormBuilder } from '@/modules/form-builder/hooks/use-form-builder';

type FormBuilderContextValue = ReturnType<typeof useFormBuilder>;

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export const FormBuilderProvider = ({ children }: { children: ReactNode }) => {
  const value = useFormBuilder();
  return <FormBuilderContext value={value}>{children}</FormBuilderContext>;
};

export const useFormBuilderContext = (): FormBuilderContextValue => {
  const ctx = use(FormBuilderContext);
  if (!ctx) {
    throw new Error(
      'useFormBuilderContext must be used within a FormBuilderProvider',
    );
  }
  return ctx;
};
