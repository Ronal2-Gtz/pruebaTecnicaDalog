import { describe, it, expect, beforeEach } from 'vitest';
import { useReportStore } from './useReportStore';

describe('useReportStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const initialState = useReportStore.getState();
    useReportStore.setState({ ...initialState, reports: [], searchQuery: '', isUploading: false });
  });

  it('should initialize with empty arrays on reset', () => {
    const state = useReportStore.getState();
    expect(state.reports.length).toBe(0);
    expect(state.searchQuery).toBe('');
    expect(state.isUploading).toBe(false);
  });

  it('should successfully filter or remove reports', () => {
    // Seed and test removal
    useReportStore.setState({
      reports: [
        { id: '1', filename: 'test.pdf', fileSize: 100, uploadDate: '2023-01-01', status: 'success', type: 'PDF' },
        { id: '2', filename: 'test.dcm', fileSize: 200, uploadDate: '2023-01-02', status: 'success', type: 'DCM' },
      ],
    });

    const { removeReport } = useReportStore.getState();
    removeReport('1');

    const state = useReportStore.getState();
    expect(state.reports.length).toBe(1);
    expect(state.reports[0].id).toBe('2');
  });

  it('should allow searching by query in local state', () => {
    const { setSearchQuery } = useReportStore.getState();
    setSearchQuery('vibration');
    expect(useReportStore.getState().searchQuery).toBe('vibration');
  });
});
