import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UnauthorizedException,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { use } from 'passport';
import { Serialize } from '../decorators/serialize.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { SerializeInterceptor } from '../interceptors/serialize/serialize.interceptor';

class LoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  @Post('/signin')
  async signin(@Body() dto: any) {
    const token = await this.authService.signin(dto.username, dto.password);
    return { access_token: token };
  }

  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  async signup(@Body() dto: any) {
    return await this.authService.signup(dto.username, dto.password);
  }
}
