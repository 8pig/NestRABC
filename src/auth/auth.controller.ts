import {
  Body,
  Controller,
  HttpException,
  Post,
  UnauthorizedException,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { use } from 'passport';

@Controller('auth')
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
  signup(@Body() dto: any) {
    console.log(dto);
    if (!dto.username || !dto.password) {
      throw new HttpException('用户名密码不得为空', 400);
    }
    return this.authService.signup(dto.username, dto.password);
  }
}
