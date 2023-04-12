import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { IGetUserDTO } from './DTO/user.dto';
import { conditionUtils } from '../utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(query: IGetUserDTO) {
    const { limit: take = 10, page, username, gender, role } = query;
    const skip = ((page || 1) - 1) * take;
    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };
    const qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.profile', 'profile')
      .innerJoinAndSelect('user.roles', 'roles');
    const newQb = conditionUtils<User>(qb, obj);
    return newQb.limit(take).skip(skip).getMany();
    // .where('user.username = :username', { username })
    // .andWhere('profile.gender = :gender', { gender })
    // .andWhere('roles.id = :role', { role })
    // .getMany();

    // const { limit: take = 10, page, username, gender, role } = query;
    // const skip = ((page || 1) - 1) * take;
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       photo: true,
    //       gender: true,
    //       address: true,
    //     },
    //     roles: {
    //       id: true,
    //       name: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip,
    // });
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);

    // try {
    const res = await this.userRepository.save(userTmp);
    return res;
    // } catch (e) {
    //   console.log(e);
    //   if (e?.errno === 1062) {
    //     throw new HttpException(e.sqlMessage, 500);
    //   }
    // }
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository.query(
    //   'SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result',
    // );
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        // .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
