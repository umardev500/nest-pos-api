import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @Type(() => Number) // 👈 from class-transformer
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
