import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { TopPageModel, TopPageSchema } from './top-page.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageService } from './top-page.service';
import { UniqueAliasValidator } from './validators/top-page.dto.validator';

@Module({
    controllers: [TopPageController],
    imports: [
        MongooseModule.forFeature([
            { name: TopPageModel.name, schema: TopPageSchema, collection: 'TopPage' },
        ]),
    ],
    providers: [TopPageService, UniqueAliasValidator],
})
export class TopPageModule {}
