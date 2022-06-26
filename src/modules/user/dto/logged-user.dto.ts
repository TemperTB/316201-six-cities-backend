import {Expose} from 'class-transformer';

export default class LoggedUserDto {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public name!: string;
}
