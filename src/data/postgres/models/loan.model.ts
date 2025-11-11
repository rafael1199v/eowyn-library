import { CustomError } from '../../../domain';
import { db } from '../knex';

interface CreateLoanDTO {
  userId: number;
  bookId: number;
  dueDate: Date;
}

const LOAN_TABLE = 'loans';

export const LoanModel = {
  async userHasActiveLoan(userId: number, bookId: number) {
    return db(LOAN_TABLE)
      .where({ user_id: userId, book_id: bookId})
      .whereIn('status', ['ongoing', 'overdue'])
      .first();
  },

  async activeLoansByUser(userId: number) {
    return db(LOAN_TABLE)
      .where({ user_id: userId})
      .whereIn('status', ['ongoing', 'overdue'])
      .count('id as total')
      .first();
  },

  async createLoanWithTransaction(loanDto: CreateLoanDTO) {
    return await db.transaction(async (trx) => {
      const book = await trx('books')
        .where({ id: loanDto.bookId })
        .forUpdate()
        .first();

      if (!book) {
        throw CustomError.badRequest(`Book with id: ${loanDto.bookId} does not exist`);
      }

      if (book.available_quantity <= 0) {
        throw CustomError.badRequest(`Book with id: ${loanDto.bookId} has no available copies`);
      }

      const [loan] = await trx(LOAN_TABLE)
        .insert({
          user_id: loanDto.userId,
          book_id: loanDto.bookId,
          start_date: trx.raw('CURRENT_DATE'),
          due_date: loanDto.dueDate,
          status: 'ongoing',
        })
        .returning('*');

      await trx('books')
        .where({ id: loanDto.bookId })
        .decrement('available_quantity', 1);

      return loan;
    });
  },
  async getById(id: number) {
    return db(LOAN_TABLE)
      .where({ id })
      .first();
  },
  async returnLoanWithTransaction(id: number) {
    return await db.transaction(async (trx) => {
      const loan = await trx(LOAN_TABLE)
        .where({ id })
        .forUpdate()
        .first();
      if (!loan) {
        throw CustomError.badRequest(`Loan with id: ${id} does not exist`);
      }
      const [updatedLoan] = await trx(LOAN_TABLE)
        .where({ id })
        .update({
          return_date: trx.raw('CURRENT_DATE'),
          status: 'returned',
        })
        .returning('*');
      await trx('books')
        .where({ id: loan.book_id })
        .increment('available_quantity', 1);
      return updatedLoan;
    });
  }

};