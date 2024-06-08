import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTrackDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}
