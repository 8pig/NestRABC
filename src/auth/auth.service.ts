import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IGetUserDTO } from '../user/DTO/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

argon2;
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signin(username: string, password: string) {
    // const res = await this.userService.findAll(<IGetUserDTO>{ username });

    const user = await this.userService.find(username);
    if (!user) {
      throw new ForbiddenException('用户不存在, 请注册');
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
    });
  }
  async signup(username: string, password: string) {
    const user = await this.userService.find(username);
    console.log('signup', user);
    if (user) {
      throw new ForbiddenException('用户已存在');
    }

    return await this.userService.create({ username: username, password });
  }
}
