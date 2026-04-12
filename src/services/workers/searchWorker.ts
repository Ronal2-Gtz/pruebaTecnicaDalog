import { DiagnosticReport } from '@/types/reports';

self.onmessage = (event: MessageEvent<{ reports: DiagnosticReport[]; query: string }>) => {
  const { reports, query } = event.data;

  if (!query || query.trim() === '') {
    self.postMessage(reports);
    return;
  }

  const lowercaseQuery = query.toLowerCase();

  const filtered = reports.filter(report => {
    return (
      report.filename.toLowerCase().includes(lowercaseQuery) ||
      report.type.toLowerCase().includes(lowercaseQuery) ||
      report.id.toLowerCase().includes(lowercaseQuery)
    );
  });

  self.postMessage(filtered);
};
