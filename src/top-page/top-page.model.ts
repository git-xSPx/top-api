import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel>;

export enum TopLevelCategory {
    Courses,
    Services,
    Books,
    Products,
}

class HhData {
    @Prop()
    count: number;

    @Prop()
    juniorSalary: number;

    @Prop()
    middleSalary: number;

    @Prop()
    seniorSalary: number;
}

@Schema()
export class TopPageAdvantage {
    @Prop()
    title: string;

    @Prop()
    description: string;
}

export const TopPageAdvantageSchema = SchemaFactory.createForClass(TopPageAdvantage);

@Schema({ timestamps: true })
export class TopPageModel {
    @Prop({ enum: TopLevelCategory })
    firstCategory: TopLevelCategory;

    @Prop()
    secondCategory: string;

    @Prop({ unique: true })
    alias: string;

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop({ type: HhData })
    hh?: HhData;

    @Prop([TopPageAdvantageSchema])
    advantages: TopPageAdvantage[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitles: string;

    @Prop([String])
    tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel).index({ '$**': 'text' });
