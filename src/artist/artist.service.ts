import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { checkEntityById } from 'src/utils/modelValidators';
import { createPassword } from 'src/utils/createPassword';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
    constructor(private prismaService: PrismaService) {}
    async getArtist(id: string): Promise<Artist> {
        const artist = await this.prismaService.artist.findUnique({
            where: {
                id,
            },
        });
        return checkEntityById(id, artist);
    }
    async create(createArtistDto: CreateArtistDto): Promise<Artist> {
        const newArtist = {
            id: createPassword(),
            ...createArtistDto,
            favoritesId: null,
        };
        await this.prismaService.artist.create({ data: newArtist });
        return newArtist;
    }

    async findAll(): Promise<Artist[]> {
        const artists = await this.prismaService.artist.findMany();
        return artists;
    }

    async findOne(id: string): Promise<Artist> {
        const artist = await this.getArtist(id);
        return artist;
    }

    async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
        const artist = await this.getArtist(id);
        const updatedArtist = await this.prismaService.artist.update({
            where: { id: artist.id },
            data: {
                name: updateArtistDto.name,
                grammy: updateArtistDto.grammy,
            },
        });
        return updatedArtist;
    }

    async remove(id: string): Promise<void> {
        const artist = await this.getArtist(id);
        await this.prismaService.artist.delete({ where: { id: artist.id } });
    }
}
