import { CustomError } from "../errors/custom.error";

export class UserEntity {
  
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly password: string,
    public readonly role: string,
    public readonly img: string,
  ) {}

  static fromObject(object: {[key:string]: any}) {
    const { id, name, email, emailValidated, password, role, img } = object;
    if ( !id ){
      throw CustomError.badRequest('User id is required');
    }
    if ( !name ){
      throw CustomError.badRequest('User name is required');
    }
    if ( !email ){
      throw CustomError.badRequest('User email is required');
    }
    if ( emailValidated === undefined ){
      throw CustomError.badRequest('User emailValidated is required');
    }
    if ( !password ){
      throw CustomError.badRequest('User password is required');
    }
    if ( !role ){
      throw CustomError.badRequest('User role is required');
    }
    // if ( !img ){
    //   throw CustomError.badRequest('User img is required');
    // }
    return new UserEntity(id, name, email, emailValidated, password, role, img);
  }

}