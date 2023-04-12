import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Inject,
  LoggerService,
  Query,
  UseFilters,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IGetUserDTO } from './DTO/user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(@Query() query: IGetUserDTO): any {
    console.log(query);
    return this.userService.findAll(query);
    // return this.userService.getUsers();
  }

  @Post()
  addUser(@Body() user: User): any {
    // todo 解析Body参数
    // const user = { username: 'toimc', password: '123456' } as User;
    // return this.userService.addUser();
    return this.userService.create(user);
  }
  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    // 判断是否是自己
    // 判断用户是否有更新user的权限
    // 不能包含敏感信息
    const user = <User>dto;
    return this.userService.update(1, user);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    // todo 传递参数id
    return this.userService.remove(id);
  }

  @Get('/profile')
  getUserProfile(@Query() query): any {
    // username gender role profile sort
    return this.userService.findProfile(2);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    // return res.map((o) => ({
    //   result: o.result,
    //   count: o.count,
    // }));
    return res;
  }
}
