import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { RolesModule } from '../roles/roles.module';
import { Roles } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles]), RolesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
