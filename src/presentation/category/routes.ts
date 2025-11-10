import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddlware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';




export class CategoryRoutes {


  static get routes(): Router {
    const router = Router();
    const categoryService = new CategoryService();

    const controller = new CategoryController(categoryService);
    
    router.post('/', [ AuthMiddlware.validateJWT],controller.createCategory)
    router.get('/', [AuthMiddlware.validateJWT], controller.getCategories );
    router.put('/:id', [AuthMiddlware.validateJWT], controller.updateCategory );
    router.delete('/:id', [AuthMiddlware.validateJWT], controller.deleteCategory );



    return router;
  }


}

