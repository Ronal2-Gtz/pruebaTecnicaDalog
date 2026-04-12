'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { DiagnosticReport } from '@/types/reports';
import { ReportRow } from './ReportRow';
import { Search } from 'lucide-react';

export function ReportList() {
  const reports = useReportStore((state) => state.reports);
  const searchQuery = useReportStore((state) => state.searchQuery);
  const setSearchQuery = useReportStore((state) => state.setSearchQuery);
  const removeReport = useReportStore((state) => state.removeReport);

  const [filteredReports, setFilteredReports] = useState<DiagnosticReport[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('@/services/workers/searchWorker.ts', import.meta.url));

    workerRef.current.onmessage = (event: MessageEvent<DiagnosticReport[]>) => {
      setFilteredReports(event.data);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ reports, query: searchQuery });
    }
  }, [reports, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = useCallback((id: string) => {
    removeReport(id);
  }, [removeReport]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative glass-panel rounded-xl flex items-center px-4 py-3">
        <Search size={18} className="text-slate-500 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Buscar reportes por ID, nombre o tipo..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-600 w-full text-sm font-mono"
        />
        {filteredReports.length > 0 && searchQuery && (
          <span className="text-xs text-cyber-teal bg-cyber-teal/10 px-2 py-1 rounded font-mono ml-2 shrink-0">
            {filteredReports.length} results
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 min-h-[400px]">
        {filteredReports.length === 0 && !searchQuery && (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 border border-dashed border-slate-700/50 rounded-xl">
            No hay reportes cargados. Utiliza el área superior para subir uno.
          </div>
        )}

        {filteredReports.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center h-[200px] text-slate-500 glass-panel rounded-xl">
            No se encontraron coincidencias para "{searchQuery}"
          </div>
        )}

        {filteredReports.map((report, index) => (
          <ReportRow
            key={report.id}
            index={index}
            report={report}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
