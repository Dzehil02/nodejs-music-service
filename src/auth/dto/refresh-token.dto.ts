import { IsInvalidRefreshToken } from '../../decorators/is-invalid-refresh-token';

export class RefreshTokenDto {
    @IsInvalidRefreshToken()
    refreshToken: string;
}
