import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { checkEntityById } from 'src/utils/modelValidators';
import { createPassword } from 'src/utils/createPassword';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
    constructor(private prismaService: PrismaService) {}
    async getAlbum(id: string): Promise<Album> {
        const album = await this.prismaService.album.findUnique({
            where: {
                id,
            },
        });
        return checkEntityById(id, album);
    }
    async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
        const newAlbum = {
            id: createPassword(),
            ...createAlbumDto,
            favoritesId: null,
        };
        await this.prismaService.album.create({ data: newAlbum });
        return newAlbum;
    }

    async findAll(): Promise<Album[]> {
        const albums = await this.prismaService.album.findMany();
        return albums;
    }

    async findOne(id: string): Promise<Album> {
        const album = await this.getAlbum(id);
        return album;
    }

    async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
        const album = await this.getAlbum(id);
        const updatedAlbum = await this.prismaService.album.update({
            where: { id: album.id },
            data: {
                name: updateAlbumDto.name,
                year: updateAlbumDto.year,
                artistId: updateAlbumDto.artistId,
            },
        });
        return updatedAlbum;
    }

    async remove(id: string): Promise<void> {
        const album = await this.getAlbum(id);
        await this.prismaService.album.delete({ where: { id: album.id } });
    }
}
