import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsUuidOrNull } from 'src/decorators/is-uuid-or-null.decorator';

export class CreateTrackDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUuidOrNull()
    artistId: string | null = null;

    @IsUuidOrNull()
    albumId: string | null = null;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}
