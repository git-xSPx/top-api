import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TopLevelCategory } from '../top-page.model';
import { Type } from 'class-transformer';
import { IsUniqueAlias } from '../validators/top-page.dto.validator';

class HhDataDto {
    @IsNumber()
    count: number;

    @IsNumber()
    juniorSalary: number;

    @IsNumber()
    middleSalary: number;

    @IsNumber()
    seniorSalary: number;
}

class TopPageAdvantageDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateTopPageDto {
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;

    @IsString()
    secondCategory: string;

    @IsString()
    @IsUniqueAlias()
    alias: string;

    @IsString()
    title: string;

    @IsString()
    category: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HhDataDto)
    hh: HhDataDto;

    @IsArray()
    @ValidateNested()
    @Type(() => TopPageAdvantageDto)
    advantages: TopPageAdvantageDto[];

    @IsString()
    seoText: string;

    @IsString()
    tagsTitles: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
