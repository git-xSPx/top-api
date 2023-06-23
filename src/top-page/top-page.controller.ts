import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { UpdateTopPageDto } from './dto/update-top-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const topPage = await this.topPageService.findById(id);
        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return topPage;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const topPage = await this.topPageService.findByAlias(alias);
        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return topPage;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const topPage = await this.topPageService.deleteById(id);
        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateTopPageDto) {
        const updatedTopPage = await this.topPageService.updateById(id, dto);
        if (!updatedTopPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return updatedTopPage;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() { firstCategory }: FindTopPageDto) {
        return this.topPageService.findByCategory(firstCategory);
    }

    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }
}
