import { regularExps } from '../../../config';


export class LoginUserDto {

  private constructor(
    public email: string, 
    public password: string
  ) {}

  static create ( object: {[key: string]: any} ):[string?, LoginUserDto?] {
    const { email, password } = object;
    if ( !email ) return ["Missing email", undefined];
    if ( !regularExps.email.test(email) ) return ["Invalid email", undefined];
    if ( !password ) return ["Missing password", undefined];
    if ( password.length < 6 ) return ["Password must be at least 6 characters", undefined];


    return [undefined, new LoginUserDto(email, password)];
  }

}