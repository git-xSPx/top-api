import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema({ _id: false })
class ProductCharecteristic {
    @Prop()
    name: string;

    @Prop()
    value: string;
}

export const ProductCharecteristicSchema = SchemaFactory.createForClass(ProductCharecteristic);

@Schema({ timestamps: true })
export class ProductModel {
    @Prop()
    image: string;

    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop()
    oldPrice: number;

    @Prop()
    credit: number;

    @Prop()
    description: string;

    @Prop()
    advantages: string;

    @Prop()
    disAdvantages: string;

    @Prop([String])
    categories: string[];

    @Prop([String])
    tags: string[];

    @Prop([ProductCharecteristicSchema])
    charecteristics: ProductCharecteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
