import { Router } from 'express';
import { BookController } from './controller';
import { AuthMiddlware } from '../middlewares/auth.middleware';
import { BookService } from '../services/book.service';




export class BookRoutes {


  static get routes(): Router {
    const router = Router();
    const bookService = new BookService();

    const controller = new BookController(bookService);
    
    router.post('/', [ AuthMiddlware.validateJWT],controller.createBook);
    router.get('/', [AuthMiddlware.validateJWT], controller.getBooks );
    router.put('/:id', [AuthMiddlware.validateJWT], controller.updateBook );
    router.delete('/:id', [AuthMiddlware.validateJWT], controller.deleteBook );



    return router;
  }


}