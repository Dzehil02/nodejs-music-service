export interface ModelUUID {
    id: string;
}

export type entityType = 'artist' | 'album' | 'track';

export interface User {
    id: string;
    login: string;
    password: string;
    version: number;
    createdAt: number;
    updatedAt: number;
}

export interface Artist {
    id: string;
    name: string;
    grammy: boolean;
}

export interface Track {
    id: string;
    name: string;
    artistId: string | null;
    albumId: string | null;
    duration: number;
}

export interface Album {
    id: string;
    name: string;
    year: number;
    artistId: string | null;
}

export interface Favorites {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: string;
    login: string;
}

export type UserTokens = {
    userId: string;
    login: string;
    accessToken: string;
    refreshToken: string;
};
