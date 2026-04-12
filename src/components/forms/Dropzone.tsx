'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReportStore } from '@/store/useReportStore';
import { Spinner } from '@/components/ui/Spinner';

export function Dropzone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [ariaMessage, setAriaMessage] = useState('Área de subida lista. Presiona Enter para seleccionar un archivo.');
  const inputRef = useRef<HTMLInputElement>(null);

  const addReportMock = useReportStore((state) => state.addReportMock);
  const isUploading = useReportStore((state) => state.isUploading);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
    setAriaMessage('Suelta el archivo para subirlo.');
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setAriaMessage('Área de subida lista. Presiona Enter para seleccionar un archivo.');
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  }, [addReportMock]);

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    setAriaMessage(`Subiendo archivo ${file.name}, por favor espera.`);
    const result = await addReportMock(file);

    if (result.success) {
      setAriaMessage(`Subida de ${file.name} exitosa.`);
    } else {
      setAriaMessage(`Error al subir ${file.name}: ${result.errorMessage}`);
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  const openFileDialog = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {ariaMessage}
      </div>

      <motion.div
        role="button"
        tabIndex={0}
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        animate={{
          scale: isDragActive ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          "relative flex items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyber-teal overflow-hidden glass-panel duration-300",
          isDragActive ? "border-cyber-teal bg-cyber-teal/5" : "border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/40",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          ref={inputRef}
          className="sr-only"
          onChange={onFileInputChange}
          accept="application/pdf,image/*,.dcm"
        />

        <div className="flex flex-col items-center justify-center text-center z-10">
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <Spinner size="lg" className="mb-4" />
                <p className="text-sm font-medium text-slate-300">Procesando Diagnóstico...</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-cyber-teal shadow-[0_0_20px_rgba(13,148,136,0.15)]">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-1">Arrastra y Suelta el Reporte</h3>
                <p className="text-sm text-slate-400">o haz clic para explorar tus archivos</p>
                <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                  <FileType size={14} /> Soporta PDF, DICOM, JPEG
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 bg-cyber-teal/5 blur-[100px] rounded-full pointer-events-none" />
        )}
      </motion.div>
    </div>
  );
}
