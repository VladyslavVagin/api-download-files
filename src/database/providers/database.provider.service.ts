import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
import * as mime from 'mime-types';

@Injectable()
export class DatabaseProviderService {
  getAllFiles(): any[] {
    try {
      const directoryPath = join(process.cwd(), 'uploads');
      // Check if directory exists
      if (!existsSync(directoryPath)) {
        throw new NotFoundException(`Directory ${directoryPath} not found.`);
    }
      const files = readdirSync(directoryPath);
      return files.map((file) => {
        const filePath = join(directoryPath, file);
        const fileStat = statSync(filePath);
        return {
          name: file,
          size: (fileStat.size / 1024).toFixed(2) + ' kB',
          lastModified: fileStat.mtime.toUTCString(),
        };
      });
    } catch {
      throw new RequestTimeoutException('Failed to get files');
    }
  }

  getFile(filename: string): { streamableFile: StreamableFile; headers: any } {
    try {
      const filePath = join(process.cwd(), 'uploads', filename);
      // Check if file exist
      if (!existsSync(filePath)) {
        throw new NotFoundException(`File ${filename} not found.`);
    }
      const file = createReadStream(filePath);
      const fileStat = statSync(filePath);
      const extension = extname(filename).substring(1);
      const mimeType = mime.lookup(extension) || 'application/octet-stream';

      return {
        streamableFile: new StreamableFile(file, {
          type: mimeType,
          disposition: 'inline',
        }),
        headers: {
          size: (fileStat.size / (1024 * 1024)).toFixed(2) + ' MB',
          lastModified: fileStat.mtime.toUTCString(),
        },
      };
    } catch {
      throw new RequestTimeoutException('Failed to get file');
    }
  }
}
