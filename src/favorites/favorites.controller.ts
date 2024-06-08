import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get()
    findAll() {
        return this.favoritesService.findAll();
    }

    @Post('track/:id')
    addTrack(@Param('id') id: string) {
        return this.favoritesService.addTrack(id);
    }

    @Delete('track/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteTrack(@Param('id') id: string) {
        return this.favoritesService.deleteTrack(id);
    }

    @Post('album/:id')
    addAlbum(@Param('id') id: string) {
        return this.favoritesService.addAlbum(id);
    }

    @Delete('album/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteAlbum(@Param('id') id: string) {
        return this.favoritesService.deleteAlbum(id);
    }

    @Post('artist/:id')
    addArtist(@Param('id') id: string) {
        return this.favoritesService.addArtist(id);
    }

    @Delete('artist/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteArtist(@Param('id') id: string) {
        return this.favoritesService.deleteArtist(id);
    }
}
