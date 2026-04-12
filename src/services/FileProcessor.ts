import { DiagnosticReport } from '@/types/reports';

export interface FileProcessor {
  validate(file: File): boolean;
  extractMetadata(file: File): Promise<Partial<DiagnosticReport>>;
}

export class PDFProcessor implements FileProcessor {
  validate(file: File): boolean {
    return file.type === 'application/pdf';
  }

  async extractMetadata(file: File): Promise<Partial<DiagnosticReport>> {
    return {
      type: 'PDF Document',
    };
  }
}

export class MedicalImageProcessor implements FileProcessor {
  validate(file: File): boolean {
    return file.name.toLowerCase().endsWith('.dcm') || file.type.startsWith('image/');
  }

  async extractMetadata(file: File): Promise<Partial<DiagnosticReport>> {
    return {
      type: 'Medical Image',
    };
  }
}

export class DefaultProcessor implements FileProcessor {
  validate(file: File): boolean {
    return true;
  }

  async extractMetadata(file: File): Promise<Partial<DiagnosticReport>> {
    return {
      type: 'Unknown Format',
    };
  }
}

export class FileProcessorFactory {
  private static strategies: FileProcessor[] = [
    new PDFProcessor(),
    new MedicalImageProcessor(),
  ];

  static getProcessor(file: File): FileProcessor {
    const strategy = this.strategies.find((s) => s.validate(file));
    return strategy || new DefaultProcessor();
  }
}
