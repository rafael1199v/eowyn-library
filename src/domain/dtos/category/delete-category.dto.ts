export class DeleteCategoryDto {

  private constructor(
    public id: number
  ) {}  
  static delete ( id: number ):[string?] {
    if ( !id ) return ["Missing id"];
    if ( isNaN(Number(id)) ) return ["Invalid id"];
    return [undefined];
  }
}