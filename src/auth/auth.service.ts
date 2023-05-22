import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IGetUserDTO } from '../user/DTO/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signin(username: string, password: string) {
    // const res = await this.userService.findAll(<IGetUserDTO>{ username });
    const user = await this.userService.find(username);
    if (user && user.password === password) {
      return await this.jwtService.signAsync({
        username: user.username,
        sub: user.id,
      });
    }
    throw new UnauthorizedException();
  }
  async signup(username: string, password: string) {
    const res = await this.userService.create({ username: username, password });
    return res;
  }
}
