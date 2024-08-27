import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseProviderService } from './providers/database.provider.service';

@Controller('file')
export class DatabaseController {
  constructor(
    /** Inject databaseProviderService */
    private readonly databaseProviderService: DatabaseProviderService,
  ) {}

  /** Get all documents from API */
  @Get()
  getAllFiles(@Res() res: Response): void {
    const fileData = this.databaseProviderService.getAllFiles();
    res.json(fileData);
  }

  /** Get a specific file - downloading */
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response): void {
    const file = this.databaseProviderService.getFile(filename);
    const headers = file.streamableFile.getHeaders();

    // Set metadata to headers along with downloaded file
    res.setHeader('Content-Type', headers.type);
    res.setHeader('Content-Disposition', headers.disposition);
    res.setHeader('Content-Size', file.headers.size);
    res.setHeader('Last-Modified', file.headers.lastModified);
    
    // Pipe the file stream to response
    file.streamableFile.getStream().pipe(res);
  }
}
