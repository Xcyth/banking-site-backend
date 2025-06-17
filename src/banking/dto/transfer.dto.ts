import { IsString, IsNotEmpty, IsPositive, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferDto {
  @IsNotEmpty()
  @IsString()
  recipientUsername: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
} 