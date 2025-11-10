import { Response, Request } from "express";
import { CreateCategoryDto, CustomError, DeleteCategoryDto, PaginationDto, UpdateCategoryDto } from '../../domain';
import { CategoryService } from "../services/category.service";

export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if ( error ) return res.status(400).json({ error });

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));

  };

  getCategories = (req: Request, res: Response) => {
    const  { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit)
    );
    if ( error ) return res.status(400).json({ error });

    this.categoryService.getCategories( paginationDto! )
      .then((categories) => res.status(200).json(categories))
      .catch((error) => this.handleError(error, res));
  };

  updateCategory = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, createCategoryDto] = UpdateCategoryDto.update(req.body, Number(id));
    if ( error ) return res.status(400).json({ error });

    this.categoryService.updateCategory(createCategoryDto!, Number(id))
      .then((category) => res.status(200).json(category))
      .catch((error) => this.handleError(error, res));
  }

  deleteCategory = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error] = DeleteCategoryDto.delete( Number(id) );
    if ( error ) return res.status(400).json({ error });

    this.categoryService.deleteCategory( Number(id) )
      .then(() => res.status(204).send() )
      .catch((error) => this.handleError(error, res));
  }

}