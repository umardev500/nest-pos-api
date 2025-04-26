import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsNumberString() // if you want categoryId from query string and ensure it's a number
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
