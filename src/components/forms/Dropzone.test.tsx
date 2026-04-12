import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dropzone } from './Dropzone';
import { describe, it, expect, vi } from 'vitest';
import { useReportStore } from '@/store/useReportStore';

vi.mock('@/store/useReportStore', () => ({
  useReportStore: vi.fn(),
}));

describe('Dropzone Component', () => {
  it('should render the dropzone initial state correctly', () => {
    vi.mocked(useReportStore).mockImplementation((selector: any) => {
      const state = {
        isUploading: false,
        addReportMock: vi.fn(),
      };
      return selector(state);
    });

    render(<Dropzone />);

    expect(screen.getByText('Arrastra y Suelta el Reporte')).toBeInTheDocument();

    const liveRegion = screen.getByText(/Área de subida lista/i);
    expect(liveRegion).toBeInTheDocument();
  });

  it('should display uploading ui and messages when processing', () => {
    vi.mocked(useReportStore).mockImplementation((selector: any) => {
      const state = {
        isUploading: true,
        addReportMock: vi.fn(),
      };
      return selector(state);
    });

    render(<Dropzone />);

    expect(screen.queryByText('Arrastra y Suelta el Reporte')).not.toBeInTheDocument();

    expect(screen.getByText('Procesando Diagnóstico...')).toBeInTheDocument();
  });
});
