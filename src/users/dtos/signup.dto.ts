import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupReqeustDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  public nickname: string;

  public provider: string;
}

export class UserDataRequestsDto extends SignupReqeustDto {}
