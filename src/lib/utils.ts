import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DiagnosticReport } from '@/types/reports';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const calculateTotalStorage = (
  reports: DiagnosticReport[],
  baseBytes = 0,
  capacityBytes = 1.0 * 1024 * 1024 * 1024
) => {
  const reportsBytes = reports.reduce((acc, curr) => acc + curr.fileSize, 0);
  const totalUsed = baseBytes + reportsBytes;
  const percentage = Math.min((totalUsed / capacityBytes) * 100, 100);

  return {
    totalUsed,
    totalCapacity: capacityBytes,
    percentage: percentage.toFixed(2)
  };
};
