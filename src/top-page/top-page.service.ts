import { Injectable } from '@nestjs/common';
import { TopLevelCategory, TopPageDocument, TopPageModel } from './top-page.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel.name) private readonly topPageModel: Model<TopPageDocument>,
    ) {}

    async create(dto: CreateTopPageDto) {
        const newTopPage = new this.topPageModel(dto);
        return newTopPage.save();
    }

    async findById(id: string) {
        return this.topPageModel.findById(id).exec();
    }

    async deleteById(id: string) {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .aggregate()
            .match({ firstCategory })
            .group({
                _id: { secondCategory: '$secondCategory' },
                pages: { $push: { alias: '$alias', title: '$title' } },
            })
            .exec();
    }

    async findByText(text: string) {
        return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
    }

    async findByAlias(alias: string) {
        return this.topPageModel.findOne({ alias }).exec();
    }
}
