import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( {...user, password: bcrypt.hashSync( user.password, 10 ),} ) )
    })

    await this.userRepository.save( users );
    return users[0];
  };

  async runSeed() {
    
    await this.deleteTables();

    const user = await this.insertUsers();

    await this.insertNewProducts( user );
    return 'seed executed';
  }

  private async insertNewProducts( user: User ) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productService.create( product, user ) );
    })

    await Promise.all( insertPromises );

    return true;
  }
}
