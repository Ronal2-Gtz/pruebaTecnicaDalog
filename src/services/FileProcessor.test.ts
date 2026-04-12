import { describe, it, expect } from 'vitest';
import { FileProcessorFactory, PDFProcessor, MedicalImageProcessor, DefaultProcessor } from './FileProcessor';

describe('FileProcessorFactory', () => {
  it('should return PDFProcessor for application/pdf type files', () => {
    const file = new File([''], 'report.pdf', { type: 'application/pdf' });
    const processor = FileProcessorFactory.getProcessor(file);
    expect(processor).toBeInstanceOf(PDFProcessor);
  });

  it('should return MedicalImageProcessor for .dcm extensions', () => {
    const file = new File([''], 'scan.dcm', { type: 'application/dicom' });
    const processor = FileProcessorFactory.getProcessor(file);
    expect(processor).toBeInstanceOf(MedicalImageProcessor);
  });

  it('should return DefaultProcessor for unknown files', () => {
    const file = new File([''], 'data.txt', { type: 'text/plain' });
    const processor = FileProcessorFactory.getProcessor(file);
    expect(processor).toBeInstanceOf(DefaultProcessor);
  });

  it('should extract correct metadata using processors', async () => {
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const processor = FileProcessorFactory.getProcessor(pdfFile);
    const meta = await processor.extractMetadata(pdfFile);
    expect(meta.type).toBe('PDF Document');
  });
});
