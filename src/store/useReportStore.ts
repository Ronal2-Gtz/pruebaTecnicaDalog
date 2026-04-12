import { create } from 'zustand';
import { DiagnosticReport, ReportStatus } from '@/types/reports';
import { FileProcessorFactory } from '@/services/FileProcessor';

interface ReportState {
  reports: DiagnosticReport[];
  searchQuery: string;
  isUploading: boolean;

  addReportMock: (file: File) => Promise<{ success: boolean; errorMessage?: string }>;
  updateReportStatus: (id: string, status: ReportStatus, errorMessage?: string) => void;
  setSearchQuery: (query: string) => void;
  removeReport: (id: string) => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [
    {
      id: "RPT-1001",
      filename: "resonancia_magnetica_cerebral.dcm",
      fileSize: 850_000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "success",
      type: "Medical Image"
    },
    {
      id: "RPT-1002",
      filename: "analisis_sangre_completo.pdf",
      fileSize: 850_000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: "success",
      type: "PDF Document"
    }
  ],
  searchQuery: '',
  isUploading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  removeReport: (id) => set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),

  updateReportStatus: (id, status, errorMessage) => set((state) => ({
    reports: state.reports.map((r) =>
      r.id === id ? { ...r, status, errorMessage } : r
    )
  })),

  addReportMock: async (file) => {
    const tempId = `RPT-${Math.floor(Math.random() * 9000) + 1000}`;

    const processor = FileProcessorFactory.getProcessor(file);
    const meta = await processor.extractMetadata(file);

    const newReport: DiagnosticReport = {
      id: tempId,
      filename: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      status: 'loading',
      type: meta.type || 'Unknown',
    };

    set((state) => ({
      reports: [newReport, ...state.reports],
      isUploading: true
    }));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isError = Math.random() > 0.9;

    if (isError) {
      const errorMessage = 'El servidor rechazó el archivo debido a formato inválido o red inestable.';
      get().updateReportStatus(tempId, 'error', errorMessage);
      set({ isUploading: false });
      return { success: false, errorMessage };
    } else {
      get().updateReportStatus(tempId, 'success');
      set({ isUploading: false });
      return { success: true };
    }
  }
}));
