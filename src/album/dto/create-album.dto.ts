import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsUuidOrNull } from 'src/decorators/is-uuid-or-null.decorator';

export class CreateAlbumDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    year: number;

    @IsUuidOrNull()
    artistId: string | null = null;
}
