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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createArtistDto: CreateArtistDto) {
        return this.artistService.create(createArtistDto);
    }

    @Get()
    findAll() {
        return this.artistService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.artistService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
        return this.artistService.update(id, updateArtistDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.artistService.remove(id);
    }
}
