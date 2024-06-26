import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createTrackDto: CreateTrackDto) {
        return this.trackService.create(createTrackDto);
    }

    @Get()
    findAll() {
        return this.trackService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.trackService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
        return this.trackService.update(id, updateTrackDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.trackService.remove(id);
    }
}
