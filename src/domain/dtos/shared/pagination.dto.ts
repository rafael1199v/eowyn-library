export class PaginationDto {

  private constructor(
    public page: number,
    public limit: number
  ) {}

  static create ( page: number = 1, limit : number = 10):[string?, PaginationDto?] {
    if ( isNaN(page) ||  isNaN(limit) ) return ["Page and limit must be a number", undefined];
    if( page <= 0 ) return ["Page must be at least 1", undefined];
    if( limit <= 0 ) return ["Limit must be at least 1", undefined];
    return [undefined, new PaginationDto(page, limit)];
  }

}