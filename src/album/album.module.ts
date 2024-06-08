import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [AlbumController],
    providers: [AlbumService, PrismaService],
    exports: [AlbumService],
})
export class AlbumModule {}
