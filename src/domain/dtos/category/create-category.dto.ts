export class CreateCategoryDto {

  private constructor(
    public name: string,
    public description: string
  ) {}

  static create ( object: {[key: string]: any} ):[string?, CreateCategoryDto?] {
    const { name, description } = object;
    if ( !name ) return ["Missing name", undefined];
    if ( name.length < 3 ) return ["Name must be at least 3 characters", undefined];
    if ( !description ) return ["Missing description", undefined];
    if ( description.length < 10 ) return ["Description must be at least 10 characters", undefined];
    return [undefined, new CreateCategoryDto(name, description)];
  }

}