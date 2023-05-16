import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { log } from 'console';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: any) {
    return this.authService.signin(dto.username, dto.password);
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
