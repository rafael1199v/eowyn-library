import { Response, Request } from "express";
import { CreateCategoryDto, CreateLoanDto, CustomError, DeleteCategoryDto, PaginationDto, ReturnLoanDto, UpdateCategoryDto } from '../../domain';
import { LoanService } from "../services/loan.service";

export class LoanController {

  constructor(
    private readonly loanService: LoanService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  createLoan = (req: Request, res: Response) => {
    const [error, createLoanDto] = CreateLoanDto.create({
      ...req.body,
      userId: Number(req.body.userId),
      bookId: Number(req.body.bookId),
      dueDate: new Date(req.body.dueDate),
    });
    if ( error ) return res.status(400).json({ error });

    this.loanService.createLoan(createLoanDto!)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));

  };

  returnLoan = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error] = ReturnLoanDto.return( Number(id) );
    if ( error ) return res.status(400).json({ error });
    this.loanService.returnLoan( Number(id) )
      .then((loan) => res.status(200).json(loan))
      .catch((error) => this.handleError(error, res));
  }

  // getCategories = (req: Request, res: Response) => {
  //   const  { page = 1, limit = 10 } = req.query;
  //   const [error, paginationDto] = PaginationDto.create(
  //     Number(page),
  //     Number(limit)
  //   );
  //   if ( error ) return res.status(400).json({ error });

  //   this.categoryService.getCategories( paginationDto! )
  //     .then((categories) => res.status(200).json(categories))
  //     .catch((error) => this.handleError(error, res));
  // };

  // updateCategory = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const [error, createCategoryDto] = UpdateCategoryDto.update(req.body, Number(id));
  //   if ( error ) return res.status(400).json({ error });

  //   this.categoryService.updateCategory(createCategoryDto!, Number(id))
  //     .then((category) => res.status(200).json(category))
  //     .catch((error) => this.handleError(error, res));
  // }

  // deleteCategory = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const [error] = DeleteCategoryDto.delete( Number(id) );
  //   if ( error ) return res.status(400).json({ error });

  //   this.categoryService.deleteCategory( Number(id) )
  //     .then(() => res.status(204).send() )
  //     .catch((error) => this.handleError(error, res));
  // }

}