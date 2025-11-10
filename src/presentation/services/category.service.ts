import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class CategoryService {
  constructor() {}

  async createCategory(categoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findByName(categoryDto.name);
    if (categoryExists) throw CustomError.badRequest("Category already exists");
    try {
      const category = await CategoryModel.create(categoryDto, user.id);
      return {
        id: category.id,
        name: category.name,
        description: category.description,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategories( paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([CategoryModel.getTotal(), CategoryModel.getAllWithPagination( page, limit )]);
      return {
        page: page,
        limit: limit,
        total: total?.count ? parseInt(total.count, 10) : 0,
        categories: categories.map(({ id, name, description }) => ({
          id,
          name,
          description,
        }))
  };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateCategory(categoryDto: CreateCategoryDto, id: number) {
    const categoryExists = await CategoryModel.getById(id);
    if (!categoryExists) throw CustomError.badRequest(`Category with id: ${id} does not exist`);
    try {
      const category = await CategoryModel.update(categoryDto, id);
      return {
        id: category.id,
        name: category.name,
        description: category.description,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteCategory(id: number) {
    const categoryExists = await CategoryModel.getById(id);
    if (!categoryExists) throw CustomError.badRequest(`Category with id: ${id} does not exist`);
    const hasBooks = await CategoryModel.categoryHasBooks(id);
    if (hasBooks) throw CustomError.badRequest(`Category with id: ${id} cannot be deleted because it has associated books`);
    try {
      await CategoryModel.delete(id);
      return {message: `Category with id ${id} deleted successfully`};
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}