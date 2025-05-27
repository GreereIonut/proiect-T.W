const joiToSwagger = require('joi-to-swagger');

const registerUserSchema = require('../dtos/register-user.dto');
const loginUserSchema = require('../dtos/login-user.dto');
const userResponseSchema = require('../dtos/user-response.dto');
const loginResponseSchema = require('../dtos/login-response.dto');
const createPostSchema = require('../dtos/create-post.dto');
const updatePostSchema = require('../dtos/update-post.dto');
const postResponseSchema = require('../dtos/post-response.dto');
const createCategorySchema = require('../dtos/create-category.dto');
const updateCategorySchema = require('../dtos/update-category.dto');
const categoryResponseSchema = require('../dtos/category-response.dto');

const { swagger: RegisterUserInput } = joiToSwagger(registerUserSchema);
const { swagger: LoginUserInput } = joiToSwagger(loginUserSchema);
const { swagger: UserResponse } = joiToSwagger(userResponseSchema);
const { swagger: LoginResponse } = joiToSwagger(loginResponseSchema);
const { swagger: CreatePostInput } = joiToSwagger(createPostSchema);
const { swagger: UpdatePostInput } = joiToSwagger(updatePostSchema);
const { swagger: PostResponse } = joiToSwagger(postResponseSchema);
const { swagger: CreateCategoryInput } = joiToSwagger(createCategorySchema);
const { swagger: UpdateCategoryInput } = joiToSwagger(updateCategorySchema);
const { swagger: CategoryResponse } = joiToSwagger(categoryResponseSchema);

const schemas = {
  RegisterUserInput,
  LoginUserInput,
  UserResponse,
  LoginResponse,
  CreatePostInput,
  UpdatePostInput,
  PostResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryResponse,
};

module.exports = schemas;