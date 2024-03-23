import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        UserModule,
        TrackModule,
        ArtistModule,
        AlbumModule,
        FavoritesModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
