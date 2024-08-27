import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseController } from './database.controller';
import { DatabaseProviderService } from './providers/database.provider.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseProviderService],
  imports: [
    MulterModule.register({
      dest: './uploads',
    })
  ]
})
export class DatabaseModule {}
