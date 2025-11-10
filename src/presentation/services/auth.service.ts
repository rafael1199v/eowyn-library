import { bcryptAdapter, jwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
export class AuthService {  

  constructor() {}

  public async registerUser ( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findByEmail(registerUserDto.email);
    if ( existUser ) throw CustomError.badRequest('Email already registered');

    try {

      registerUserDto.password = bcryptAdapter.hash(registerUserDto.password);
      const newUser = await UserModel.create(registerUserDto);
      //Encrypt password
      
      //JWT

      const { password, ...rest } = UserEntity.fromObject(newUser);
      return {
        user: {...rest},
        token: 'JWT-Token'
      };
    } catch (error) {
      throw CustomError.internalServer(`Error creating user: ${error}`);
    }
  }

  public async loginUser ( loginUserDto: LoginUserDto ) {

    //Check if user exists by email
    const existUser = await UserModel.findByEmail(loginUserDto.email);
    if ( !existUser ) throw CustomError.badRequest('Email not registered');

    // has match bcrypt compare (password y hash)
    const isMatch = bcryptAdapter.compare(loginUserDto.password, existUser.password);
    if ( !isMatch ) throw CustomError.unauthorized('Invalid credentials');

    const { password, ...rest } = UserEntity.fromObject(existUser);

    const token = await jwtAdapter.generateToken({ id: rest.id, email: rest.email });
    if ( !token ) throw CustomError.internalServer('Error generating JWT');
    return {
      user: { ...rest},
      token: token
    };
  }
}