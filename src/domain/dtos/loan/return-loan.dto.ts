export class ReturnLoanDto {

  private constructor(
    public id: number
  ) {}  
  static return ( id: number ):[string?] {
    if ( !id ) return ["Missing id"];
    if ( isNaN(Number(id)) ) return ["Invalid id"];
    return [undefined];
  }
}