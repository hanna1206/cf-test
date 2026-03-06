import { useEffect, useRef, useState } from 'react';

import styles from './json-modal.module.css';

interface JsonModalExportProps {
  mode: 'export';
  json: string;
  onClose: () => void;
}

interface JsonModalImportProps {
  mode: 'import';
  onApply: (json: string) => void;
  onClose: () => void;
}

type JsonModalProps = JsonModalExportProps | JsonModalImportProps;

export const JsonModal = (props: JsonModalProps) => {
  const { mode, onClose } = props;
  const [value, setValue] = useState(mode === 'export' ? props.json : '');
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Select all text in export mode for quick copying
  useEffect(() => {
    textareaRef.current?.focus();
    if (mode === 'export') textareaRef.current?.select();
  }, [mode]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleApply = () => {
    if (props.mode !== 'import') return;
    try {
      props.onApply(value);
      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Invalid JSON — please check the syntax and try again.',
      );
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(value);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="json-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="json-modal-title" className={styles.title}>
            {mode === 'export' ? 'Export JSON' : 'Import JSON'}
          </h2>
          <button
            className={styles.closeBtn}
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <p className={styles.hint}>
          {mode === 'export'
            ? 'Copy the JSON below to save your form configuration.'
            : 'Paste a JSON configuration to reconstruct the form.'}
        </p>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          readOnly={mode === 'export'}
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          {mode === 'export' ? (
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={handleCopy}
            >
              Copy to clipboard
            </button>
          ) : (
            <button
              className={styles.btnPrimary}
              type="button"
              disabled={value.trim() === ''}
              onClick={handleApply}
            >
              Apply
            </button>
          )}
          <button
            className={styles.btnSecondary}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
