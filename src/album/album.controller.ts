import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createAlbumDto: CreateAlbumDto) {
        return this.albumService.create(createAlbumDto);
    }

    @Get()
    findAll() {
        return this.albumService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.albumService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
        return this.albumService.update(id, updateAlbumDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.albumService.remove(id);
    }
}
