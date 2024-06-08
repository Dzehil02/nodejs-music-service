import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { createPassword } from 'src/utils/createPassword';
import { checkEntityById } from 'src/utils/modelValidators';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
    constructor(private prismaService: PrismaService) {}
    async getTrack(id: string): Promise<Track> {
        const track = await this.prismaService.track.findUnique({
            where: {
                id,
            },
        });
        return checkEntityById(id, track);
    }

    async create(createTrackDto: CreateTrackDto): Promise<Track> {
        const newTrack = {
            id: createPassword(),
            ...createTrackDto,
            favoritesId: null,
        };
        await this.prismaService.track.create({ data: newTrack });
        return newTrack;
    }

    async findAll(): Promise<Track[]> {
        const tracks = await this.prismaService.track.findMany();
        return tracks;
    }

    async findOne(id: string): Promise<Track> {
        const track = await this.getTrack(id);
        return track;
    }

    async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
        const track = await this.getTrack(id);
        const updatedTrack = await this.prismaService.track.update({
            where: { id: track.id },
            data: {
                name: updateTrackDto.name,
                duration: updateTrackDto.duration,
            },
        });
        return updatedTrack;
    }

    async remove(id: string): Promise<void> {
        const track = await this.getTrack(id);
        await this.prismaService.track.delete({ where: { id: track.id } });
    }
}
