import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

const lineKinds = ["LABOUR", "MATERIALS", "EXPENSE"] as const;

class CreateTimesheetLineDto {
  @IsDateString() date!: string;
  @IsIn(lineKinds) kind!: (typeof lineKinds)[number];
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) quantity!: number;
  @IsString() @IsNotEmpty() unit!: string;
  @IsInt() @Min(0) ratePence!: number;
}

export class CreateTimesheetDto {
  @IsString() @IsNotEmpty() workerId!: string;
  @IsDateString() weekEnding!: string;
  @IsInt() @Min(0) advanceRepaymentRequestedPence = 0;
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CreateTimesheetLineDto)
  lines!: CreateTimesheetLineDto[];
}
