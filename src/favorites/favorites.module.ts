import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
    controllers: [FavoritesController],
    providers: [FavoritesService, PrismaService, TrackService, AlbumService, ArtistService],
})
export class FavoritesModule {}
