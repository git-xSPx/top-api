import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreatedReviewDto {
    @IsString()
    name: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @Max(5)
    @Min(1, { message: 'Rating must be > 0' })
    @IsNumber()
    rating: number;

    product: Types.ObjectId;
}
