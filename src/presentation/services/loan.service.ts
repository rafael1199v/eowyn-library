import { BookModel, CategoryModel, LoanModel, UserModel } from "../../data";
import { CreateCategoryDto, CreateLoanDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class LoanService {
  constructor() {}

  async createLoan(loanDto: CreateLoanDto) {
    const [user, book, activeLoan] = await Promise.all([
      UserModel.findById(String(loanDto.userId)),
      BookModel.getById(loanDto.bookId),
      LoanModel.userHasActiveLoan(loanDto.userId, loanDto.bookId)
    ]);
    if (!user) throw CustomError.badRequest(`User with id: ${loanDto.userId} does not exist`);
    if (!user.role.includes('USER_ROLE')) throw CustomError.badRequest(`User with id: ${loanDto.userId} is not a member`);
    if (!book) throw CustomError.badRequest(`Book with id: ${loanDto.bookId} does not exist`);
    if (book.available_quantity  <= 0) throw CustomError.badRequest(`Book with id: ${loanDto.bookId} has no available copies`);
    if (activeLoan) throw CustomError.badRequest(`User with id: ${loanDto.userId} already has an active loan for book with id: ${loanDto.bookId}`);

    const activeLoansCount = await LoanModel.activeLoansByUser(loanDto.userId);
    const maxLoansAllowed = 3;
    if (activeLoansCount && parseInt(activeLoansCount.total as string, 10) >= maxLoansAllowed) {
      throw CustomError.badRequest(`User with id: ${loanDto.userId} has reached the maximum number of active loans (${maxLoansAllowed})`);
    }
    try {
      const loan =  await LoanModel.createLoanWithTransaction(loanDto);
      return {
        id: loan.id,
        userId: loan.user_id,
        bookId: loan.book_id,
        startDate: loan.start_date,
        dueDate: loan.due_date,
        status: loan.status,
      };

    } catch (error) {
      console.error(error);
      throw CustomError.internalServer(`There was an error creating the loan`);
    }
  }

  async returnLoan( id: number ) {
    const loan = await LoanModel.getById(id);
    if (!loan) throw CustomError.badRequest(`Loan with id: ${id} does not exist`);
    if(!['ongoing', 'overdue'].includes(loan.status)) {
      throw CustomError.badRequest(`Loan with id: ${id} has already been returned`);
    }
    try {
      const returnedLoan = await LoanModel.returnLoanWithTransaction(id);
      return {
        id: returnedLoan.id,
        userId: returnedLoan.user_id,
        bookId: returnedLoan.book_id,
        startDate: returnedLoan.start_date,
        dueDate: returnedLoan.due_date,
        returnDate: returnedLoan.return_date,
        status: returnedLoan.status,
      };
    } catch (error) {
      console.error(error);
      throw CustomError.internalServer(`There was an error returning the loan`);
    }
  }
}