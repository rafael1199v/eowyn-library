import { BookModel, CategoryModel } from "../../data";
import { CreateBookDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class BookService {
  constructor() {}

  async createBook(createBook: CreateBookDto, user: UserEntity) {
    const categoryExists = await CategoryModel.getById(createBook.categoryId);
    if (!categoryExists) throw CustomError.badRequest("Category does not exist");

    const bookExists = await BookModel.getByIsbn(createBook.isbn);
    if (bookExists) throw CustomError.badRequest("Book with this ISBN already exists");
    try {
      const book = await BookModel.create(createBook, user.id);
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publication_year,
        categoryId: book.category_id,
        totalQuantity: book.total_quantity,
        availableQuantity: book.available_quantity,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getBooks( paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, books] = await Promise.all([BookModel.getTotal(), BookModel.getAllWithPagination( page, limit )]);
      return {
        page: page,
        limit: limit,
        total: total?.count ? parseInt(total.count, 10) : 0,
        books: books.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publicationYear: book.publication_year,
          categoryId: book.category_id,
          totalQuantity: book.total_quantity,
          availableQuantity: book.available_quantity,
        }))
  };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateBook(updateBook: CreateBookDto, id: number) {
    
    const bookExists = await BookModel.getById(id);
    if (!bookExists) throw CustomError.badRequest(`Book with ID ${id} does not exist`);
    const categoryExists = await CategoryModel.getById(updateBook.categoryId);
    if (!categoryExists) throw CustomError.badRequest(`Category with ID ${updateBook.categoryId} does not exist`);
    if (updateBook.isbn !== bookExists.isbn) {
      const isbnExists = await BookModel.getByIsbn(updateBook.isbn);
      if (isbnExists) throw CustomError.badRequest("Another book with this ISBN already exists");
    }
    try {
      const book = await BookModel.update(updateBook, id);
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publication_year,
        categoryId: book.category_id,
        totalQuantity: book.total_quantity,
        availableQuantity: book.available_quantity,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteBook(id: number) {
    const bookExists = await BookModel.getById(id);
    if (!bookExists) throw CustomError.badRequest(`Book with ID ${id} does not exist`);
    const bookHasLoans = await BookModel.bookHasLoans(id);
    if (bookHasLoans) throw CustomError.badRequest(`Book with ID ${id} cannot be deleted because it has active loans`);
    if (bookExists.available_quantity < bookExists.total_quantity) {
      throw CustomError.badRequest(`Book with ID ${id} cannot be deleted because some copies are currently loaned out`);
    }
    try {
      await BookModel.delete(id);
      return;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}