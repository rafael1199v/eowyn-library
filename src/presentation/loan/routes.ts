import { Router } from 'express';
import { LoanController } from './controller';
import { AuthMiddlware } from '../middlewares/auth.middleware';
import { LoanService } from '../services/loan.service';




export class LoanRoutes {


  static get routes(): Router {
    const router = Router();
    const loanService = new LoanService();

    const controller = new LoanController(loanService);
    
    router.post('/', [ AuthMiddlware.validateJWT],controller.createLoan);
    router.put('/:id/return', [ AuthMiddlware.validateJWT], controller.returnLoan);



    return router;
  }


}

