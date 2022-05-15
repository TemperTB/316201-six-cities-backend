import CreateUserDto from './dto/city-user.dto.js';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {UserEntity} from './city.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
