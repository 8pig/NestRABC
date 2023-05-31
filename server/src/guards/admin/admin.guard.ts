import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1 获取请求对线
    const req = context.switchToHttp().getRequest();
    console.log(req.user);
    const user = await this.userService.find(req.user.usernme);
    // 2 判断
    if (user.roles.filter((role) => role.id === 1).length) {
      return true;
    }
    console.log('switchToHttp', user);
    return false;
  }
}
