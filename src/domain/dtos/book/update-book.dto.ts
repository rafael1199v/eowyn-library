export class UpdateBookDto {

  private constructor(
    public title: string,
    public author: string,
    public isbn: string,
    public publicationYear: number,
    public categoryId: number,
    public totalQuantity: number,
    public availableQuantity: number,

  ) {}

  static update ( object: {[key: string]: any}, id: number):[string?, UpdateBookDto?] {
    const { 
      title, 
      author, 
      isbn,
      publicationYear,
      categoryId,
      totalQuantity,
      availableQuantity
    } = object;
    if ( id == null ) return ["Missing book ID", undefined];
    if ( typeof id !== 'number' || id < 0 ) return ["Book ID must be a positive number", undefined];
    if ( !title ) return ["Missing title", undefined];
    if ( title.length < 3 ) return ["Title must be at least 3 characters", undefined];
    if ( !author ) return ["Missing author", undefined];
    if ( author.length < 3 ) return ["Author must be at least 3 characters", undefined];
    if ( !isbn ) return ["Missing ISBN", undefined];
    if ( isbn.length < 10 ) return ["ISBN must be at least 10 characters", undefined];
    if ( !publicationYear ) return ["Missing publication year", undefined];
    if ( typeof publicationYear !== 'number' || publicationYear < 0 ) return ["Publication year must be a positive number", undefined];
    if ( !categoryId ) return ["Missing category ID", undefined];
    if ( typeof categoryId !== 'number' || categoryId < 0 ) return ["Category ID must be a positive number", undefined];
    if ( totalQuantity == null ) return ["Missing total quantity", undefined];
    if ( typeof totalQuantity !== 'number' || totalQuantity < 0 ) return ["Total quantity must be a positive number", undefined];
    if ( availableQuantity == null ) return ["Missing available quantity", undefined];
    if ( typeof availableQuantity !== 'number' || availableQuantity < 0 ) return ["Available quantity must be a positive number", undefined];
    if ( availableQuantity > totalQuantity ) return ["Available quantity cannot be greater than total quantity", undefined];
    if ( publicationYear > new Date().getFullYear() ) return ["Publication year cannot be in the future", undefined];
    return [undefined, new UpdateBookDto(title, author, isbn, publicationYear, categoryId, totalQuantity, availableQuantity)];
  }

}