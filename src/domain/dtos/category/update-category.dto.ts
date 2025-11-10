export class UpdateCategoryDto {

  private constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}

  static update ( object: {[key: string]: any}, id: number):[string?, UpdateCategoryDto?] {
    const { name, description } = object;
    if ( !id ) return ["Missing id", undefined];
    if ( isNaN(Number(id)) ) return ["Invalid id", undefined];
    if ( !name ) return ["Missing name", undefined];
    if ( name.length < 3 ) return ["Name must be at least 3 characters", undefined];
    if ( !description ) return ["Missing description", undefined];
    if ( description.length < 10 ) return ["Description must be at least 10 characters", undefined];
    return [undefined, new UpdateCategoryDto(id, name, description)];
  }

}