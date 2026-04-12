'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';
import { FileHeart } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { formatBytes, calculateTotalStorage } from '@/lib/utils';

const Dropzone = dynamic(() => import('@/components/forms/Dropzone').then((mod) => mod.Dropzone), {
  ssr: false,
  loading: () => <div className="h-[200px] flex items-center justify-center text-slate-500 bg-slate-800/30 rounded-2xl animate-pulse">Cargando interfaz de subida...</div>
});

const ReportList = dynamic(() => import('@/components/reports/ReportList').then((mod) => mod.ReportList), {
  ssr: false,
  loading: () => <div className="h-[400px] flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700/50 rounded-xl animate-pulse">Cargando historial de reportes...</div>
});

export default function DashboardPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const reports = useReportStore((state) => state.reports);

  const { totalUsed, totalCapacity, percentage } = calculateTotalStorage(reports);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  return (
    <main className="min-h-screen relative p-6 md:p-12 lg:px-24">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-teal/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-neon-amber/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyber-teal shadow-lg shadow-cyber-teal/10">
              <FileHeart size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-200 m-0">Reportes de Diagnóstico</h1>
              <p className="text-slate-400 mt-1 text-sm font-mono">Estado del Sistema</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Oscuro
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${theme === 'light' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Claro
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-200">Subir Nuevo Diagnóstico</h2>
              </div>
              <FeatureErrorBoundary>
                <Dropzone />
              </FeatureErrorBoundary>
            </section>

            <div className="glass-panel rounded-2xl p-6 mt-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Almacenamiento</h3>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-teal to-neon-amber transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                <span>{formatBytes(totalUsed)} usados</span>
                <span>{formatBytes(totalCapacity)} totales</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-medium text-slate-200">Historial de Reportes</h2>
                <div className="w-2 h-2 rounded-full border-2 border-cyber-teal animate-pulse" title="Live Sync Active"></div>
              </div>
              <FeatureErrorBoundary>
                <ReportList />
              </FeatureErrorBoundary>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
