import { Response, Request } from "express";
import { CreateBookDto, CustomError, DeleteBookDto, PaginationDto, UpdateBookDto } from '../../domain';
import { BookService } from "../services/book.service";

export class BookController {

  constructor(
    private readonly bookService: BookService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  createBook = (req: Request, res: Response) => {
    const [error, createBookDto] = CreateBookDto.create({
      ...req.body,
      publicationYear: Number(req.body.publicationYear),
      categoryId: Number(req.body.categoryId),
      totalQuantity: Number(req.body.totalQuantity),
      availableQuantity: Number(req.body.availableQuantity),
    });
    if ( error ) return res.status(400).json({ error });

    this.bookService.createBook(createBookDto!, req.body.user)
      .then((book) => res.status(201).json(book))
      .catch((error) => this.handleError(error, res));

  };

  getBooks = (req: Request, res: Response) => {
    const  { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit)
    );
    if ( error ) return res.status(400).json({ error });

    this.bookService.getBooks( paginationDto! )
      .then((books) => res.status(200).json(books))
      .catch((error) => this.handleError(error, res));
  };

  updateBook = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, createBookDto] = UpdateBookDto.update({
      ...req.body,
      publicationYear: Number(req.body.publicationYear),
      categoryId: Number(req.body.categoryId),
      totalQuantity: Number(req.body.totalQuantity),
      availableQuantity: Number(req.body.availableQuantity),
    }, Number(id));
    if ( error ) return res.status(400).json({ error });

    this.bookService.updateBook(createBookDto!, Number(id))
      .then((book) => res.status(201).json(book))
      .catch((error) => this.handleError(error, res));
  }

  deleteBook = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error] = DeleteBookDto.delete( Number(id) );
    if ( error ) return res.status(400).json({ error });

    this.bookService.deleteBook( Number(id) )
      .then(() => res.status(204).send() )
      .catch((error) => this.handleError(error, res));
  }

}