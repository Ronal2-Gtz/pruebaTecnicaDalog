export type ReportStatus = 'loading' | 'success' | 'error';

export interface DiagnosticReport {
  id: string;
  filename: string;
  fileSize: number;
  uploadDate: string;
  status: ReportStatus;
  type: string;
  errorMessage?: string;
}

export interface ReportFilterState {
  searchQuery: string;
}
