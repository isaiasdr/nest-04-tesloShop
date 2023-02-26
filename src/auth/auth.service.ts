import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
      });
      await this.userRepository.save( user );
      delete user.password;
      
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );

    return token;
  }
  
  async login( loginUserDto: LoginUserDto ) {
    //try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({ 
        where: { email }, 
        select: { email: true, password: true, id: true } 
      });

      if ( !user )
        throw new UnauthorizedException('Credentials are not valid');

      if ( !bcrypt.compareSync( password, user.password ) )
        throw new UnauthorizedException('Credentials are not valid');

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    /* } catch (error) {
      this.handleDBErrors(error);
    } */
  }

  checkAuthStatus( user: User ) {
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullName,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private handleDBErrors( error: any ): never {
    if (error.code === '23505')
      throw new BadRequestException( error.detail )

    throw new InternalServerErrorException('Please check server logs');
  }
}
