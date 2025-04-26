import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFilterRequestDto {
  @IsOptional()
  @Type(() => Number) // 👈 from class-transformer
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class ProductFilterDto extends ProductFilterRequestDto {
  @IsOptional()
  merchantId?: number; // This will be used to filter by merchant
}
