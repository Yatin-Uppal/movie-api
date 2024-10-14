import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './users.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  // user utils to find / create or update
  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(userId: number, userInformation: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(userId, userInformation);
  }
}
