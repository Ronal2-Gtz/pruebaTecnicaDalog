'use client';

import React, { memo } from 'react';
import { DiagnosticReport } from '@/types/reports';
import { FileText, Image as ImageIcon, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportRowProps {
  report: DiagnosticReport;
  onDelete: (id: string) => void;
  index: number;
}

import { cn, formatBytes } from '@/lib/utils';

function ReportRowComponent({ report, onDelete, index }: ReportRowProps) {
  const isError = report.status === 'error';
  const isLoading = report.status === 'loading';
  const isSuccess = report.status === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
        isError ? "bg-red-950/10 border-red-900/50" : "glass-panel hover:bg-slate-800/60"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
        isError ? "bg-red-900/20 text-red-500" :
          report.type === 'PDF Document' ? "bg-red-500/10 text-red-400" :
            "bg-cyber-teal/10 text-cyber-teal"
      )}>
        {report.type === 'Medical Image' ? <ImageIcon size={24} /> : <FileText size={24} />}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-200 truncate pr-4">{report.filename}</h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
          <span>{report.id}</span>
          <span>&bull;</span>
          <span>{formatBytes(report.fileSize)}</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline truncate">{new Date(report.uploadDate).toLocaleString()}</span>
        </div>
        {isError && report.errorMessage && (
          <p className="text-xs text-red-400 mt-1">{report.errorMessage}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-end w-24">
        {isLoading && (
          <div className="flex items-center gap-2 text-neon-amber text-xs font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-amber"></span>
            </span>
            Procesando
          </div>
        )}
        {isSuccess && (
          <div className="flex items-center gap-1 text-cyber-teal text-xs font-medium">
            <CheckCircle2 size={16} /> Completado
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
            <AlertCircle size={16} /> Fallo
          </div>
        )}
      </div>

      <div className="shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(report.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          aria-label={`Eliminar reporte ${report.filename}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

    </motion.div>
  );
}

export const ReportRow = memo(ReportRowComponent);
