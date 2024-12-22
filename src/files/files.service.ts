import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.resolve(__dirname, '../../uploads');

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create uploads directory',
      );
    }
  }

  async handleFileUpload(file: Express.Multer.File): Promise<string> {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);

    try {
      await fs.writeFile(filePath, file.buffer);
      return `/uploads/${uniqueFileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file');
    }
  }
}
