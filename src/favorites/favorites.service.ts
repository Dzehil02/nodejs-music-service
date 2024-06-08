import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Favorites } from '@prisma/client';
import { entityType } from 'src/types/types';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackService } from 'src/track/track.service';
import { createPassword } from 'src/utils/createPassword';
import { favsData } from './const/favsData';

@Injectable()
export class FavoritesService {
    constructor(
        private prismaService: PrismaService,
        private trackService: TrackService,
        private albumService: AlbumService,
        private artistService: ArtistService,
    ) {}
    private async getEntityById(entityType: entityType, id: string): Promise<any> {
        try {
            let entity;
            switch (entityType) {
                case 'track':
                    entity = await this.trackService.getTrack(id);
                    break;
                case 'album':
                    entity = await this.albumService.getAlbum(id);
                    break;
                case 'artist':
                    entity = await this.artistService.getArtist(id);
                    break;
                default:
                    throw new Error(`Invalid entity type: ${entityType}`);
            }

            if (!entity) {
                throw new UnprocessableEntityException(`Entity with id ${id} does not exist`);
            }

            return entity;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new UnprocessableEntityException(`Entity with id ${id} does not exist`);
            }
            throw error;
        }
    }
    async findAll(): Promise<Favorites> {
        let favorites = await this.prismaService.favorites.findFirst({
            include: {
                tracks: {
                    select: { id: true, name: true, duration: true, albumId: true, artistId: true },
                },
                albums: {
                    select: { id: true, name: true, year: true, artistId: true },
                },
                artists: {
                    select: { id: true, name: true, grammy: true },
                },
            },
        });

        if (!favorites) {
            favorites = await this.prismaService.favorites.create({
                data: favsData,
                include: {
                    tracks: true,
                    albums: true,
                    artists: true,
                },
            });
        }

        return favorites;
    }

    async addTrack(id: string): Promise<Favorites> {
        await this.getEntityById('track', id);

        const favorites = await this.prismaService.favorites.findFirst({
            select: { id: true, tracks: true },
        });

        if (!favorites) {
            await this.prismaService.favorites.create({
                data: {
                    id: createPassword(),
                    tracks: { connect: { id } },
                },
            });
        } else {
            await this.prismaService.favorites.update({
                where: { id: favorites.id },
                data: {
                    tracks: { connect: { id } },
                },
            });
        }

        return favorites;
    }

    async deleteTrack(id: string): Promise<void> {
        await this.getEntityById('track', id);

        const favorite = await this.prismaService.favorites.findFirst({
            where: {
                tracks: { some: { id } },
            },
            include: {
                tracks: true,
            },
        });

        if (!favorite) {
            throw new NotFoundException(`Track with id ${id} does not exist in favorites`);
        }

        const updatedTracks = favorite.tracks.filter((track) => track.id !== id);

        await this.prismaService.favorites.update({
            where: { id: favorite.id },
            data: {
                tracks: { set: updatedTracks },
            },
        });
    }

    async addAlbum(id: string) {
        await this.getEntityById('album', id);

        const favorites = await this.prismaService.favorites.findFirst({
            select: { id: true, albums: true },
        });

        if (!favorites) {
            await this.prismaService.favorites.create({
                data: {
                    id: createPassword(),
                    albums: { connect: { id } },
                },
            });
        } else {
            await this.prismaService.favorites.update({
                where: { id: favorites.id },
                data: {
                    albums: { connect: { id } },
                },
            });
        }

        return favorites;
    }

    async deleteAlbum(id: string) {
        await this.getEntityById('album', id);

        const favorite = await this.prismaService.favorites.findFirst({
            where: {
                albums: { some: { id } },
            },
            include: {
                albums: true,
            },
        });

        if (!favorite) {
            throw new NotFoundException(`Track with id ${id} does not exist in favorites`);
        }

        const updatedAlbums = favorite.albums.filter((album) => album.id !== id);

        await this.prismaService.favorites.update({
            where: { id: favorite.id },
            data: {
                albums: { set: updatedAlbums },
            },
        });
    }

    async addArtist(id: string) {
        await this.getEntityById('artist', id);

        const favorites = await this.prismaService.favorites.findFirst({
            select: { id: true, artists: true },
        });

        if (!favorites) {
            await this.prismaService.favorites.create({
                data: {
                    id: createPassword(),
                    artists: { connect: { id } },
                },
            });
        } else {
            await this.prismaService.favorites.update({
                where: { id: favorites.id },
                data: {
                    artists: { connect: { id } },
                },
            });
        }

        return favorites;
    }

    async deleteArtist(id: string) {
        await this.getEntityById('artist', id);

        const favorite = await this.prismaService.favorites.findFirst({
            where: {
                artists: { some: { id } },
            },
            include: {
                artists: true,
            },
        });

        if (!favorite) {
            throw new NotFoundException(`Track with id ${id} does not exist in favorites`);
        }

        const updatedArtists = favorite.artists.filter((artist) => artist.id !== id);

        await this.prismaService.favorites.update({
            where: { id: favorite.id },
            data: {
                artists: { set: updatedArtists },
            },
        });
    }
}
