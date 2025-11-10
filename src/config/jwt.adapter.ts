import jwt, {SignOptions} from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class jwtAdapter {

  constructor() {}

  static generateToken ( payload: any, duration: any = '2h' ) {

    return new Promise((resolve) => {
      const options: SignOptions = {
        expiresIn: duration
      };

      jwt.sign( payload, JWT_SEED, options , ( err, token ) => {
        if ( err )  return resolve(null);

        resolve( token );
      });

    })
  }

  static validateToken<T>( token: string ): Promise<T | null> {
    return new Promise( ( resolve ) => {
      jwt.verify( token, JWT_SEED, ( err, decoded ) => {
        if ( err ) return resolve(null);
        resolve( decoded as T );
      });
    });
  }

}