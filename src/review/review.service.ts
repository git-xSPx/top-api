import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, ReviewModel } from './review.model';
import { Model, Types, Schema as MSchema } from 'mongoose';
import { CreatedReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(ReviewModel.name) private reviewModel: Model<ReviewDocument>) {}

    async create(dto: CreatedReviewDto): Promise<ReviewDocument> {
        const newReview = new this.reviewModel(dto);
        return newReview.save();
    }

    async delete(id: string): Promise<ReviewDocument | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return this.reviewModel.find({ product: new Types.ObjectId(productId) }).exec();
    }

    async deleteByProductId(productId: string) {
        return this.reviewModel.deleteMany({ product: new Types.ObjectId(productId) }).exec();
    }
}
