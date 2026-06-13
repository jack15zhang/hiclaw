import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

class LoginDto {
  @IsIn(['phone', 'google', 'facebook'])
  provider!: 'phone' | 'google' | 'facebook';

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  oauthToken?: string;
}

@Controller('auth')
export class AuthController {
  @Post('quick-login')
  quickLogin(@Body() body: LoginDto) {
    return {
      accessToken: 'dev-access-token',
      refreshToken: 'dev-refresh-token',
      user: {
        id: 'dev-user-1',
        displayName: body.provider === 'phone' ? 'Phone user' : `${body.provider} user`,
        trustLevel: 1,
      },
    };
  }
}
