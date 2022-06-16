import {User} from '../../types/user.type.js';
import typegoose, {getModelForClass} from '@typegoose/typegoose';
import {Base, TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {createSHA256} from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends TimeStamps implements User {

  constructor(data: User) {
    super();
    this.email = data.email;
    this.avatarUrl = data.avatarUrl;
    this.name = data.name;
    this.isPro = data.isPro;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({required: true, default: 'avatar-angelina.jpg'})
  public avatarUrl!: string;

  @prop({required: true, trim: true})
  public name!: string;

  @prop({required: true})
  public isPro!: boolean;

  @prop({required: true})
  private password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
