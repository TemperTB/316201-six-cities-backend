import {IsInt, IsString, Length, Min, Max} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  public userId!: string;

  public offerId!: string;

  @IsInt({message: 'Rating must be an integer'})
  @Min(1, {message: 'Minimum rating is 1'})
  @Max(5, {message: 'Maximum rating is 5'})
  public rating!: number;
}
