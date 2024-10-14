import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginregisterDTO } from './dtos/login.dto';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() body: LoginregisterDTO) {
    return this.authService.login(body);
  }
  @ApiOperation({ summary: 'Register new user' })
  @Post('register')
  async regiser(@Body() body: LoginregisterDTO) {
    return this.authService.register(body);
  }
}
