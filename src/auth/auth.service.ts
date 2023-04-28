import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IGetUserDTO } from '../user/DTO/user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(username: string, password: string) {
    const res = await this.userService.findAll(<IGetUserDTO>{ username });
    return res;
  }
  async signup(username: string, password: string) {
    const res = await this.userService.create({ username: username, password });
    return res;
  }
}
