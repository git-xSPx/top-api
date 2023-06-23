import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTopPageDto } from '../src/top-page/dto/create-top-page.dto';
import { FindTopPageDto } from '../src/top-page/dto/find-top-page.dto';
import { TopLevelCategory } from '../src/top-page/top-page.model';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { useContainer } from 'class-validator';

const authDto: AuthDto = {
    login: 'aaa@dom.com',
    password: '123',
};

const createDto: CreateTopPageDto = {
    firstCategory: TopLevelCategory.Courses,
    secondCategory: 'PHP',
    alias: 'PHP',
    title: 'PHP Course',
    category: 'PHP',
    hh: {
        count: 100500,
        juniorSalary: 1000,
        middleSalary: 2000,
        seniorSalary: 3500,
    },
    advantages: [
        {
            title: 'advantage1',
            description: 'advantage1 description',
        },
        {
            title: 'advantage2',
            description: 'advantage2 description',
        },
    ],
    seoText: 'php seo text',
    tagsTitles: 'php,tags',
    tags: ['php', 'tags'],
};

describe('TopPageController (E2E)', () => {
    let app: INestApplication;
    let createdTopPageId = '';
    let token = '';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        useContainer(app.select(AppModule), { fallbackOnErrors: true });
        app.useGlobalPipes(new ValidationPipe()); // Apply the validation pipe globally

        await app.init();

        const { body } = await request(app.getHttpServer()).post('/auth/login').send(authDto);
        token = body.access_token;
    });

    afterAll(async () => {
        disconnect();
        await app.close();
    });

    it('POST /top-page/create (create)', () => {
        return request(app.getHttpServer())
            .post('/top-page/create')
            .set('Authorization', 'Bearer ' + token)
            .send(createDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
                createdTopPageId = response.body._id; // Save the created top page ID for further tests
            });
    });

    it(`GET /top-page/${createdTopPageId} (get)`, () => {
        return request(app.getHttpServer())
            .get(`/top-page/${createdTopPageId}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(HttpStatus.OK)
            .expect((response) => {
                expect(response.body._id).toEqual(createdTopPageId); // Assert the response body as needed
            });
    });

    it(`GET /top-page/byAlias/:alias (getByAlias)`, () => {
        const alias = createDto.alias; // Use the alias from the createDto

        return request(app.getHttpServer())
            .get(`/top-page/byAlias/${alias}`)
            .expect(HttpStatus.OK)
            .expect((response) => {
                expect(response.body.alias).toEqual(alias); // Assert the response body as needed
            });
    });

    const newTitle = 'New PHP title';
    it(`PATCH /top-page/${createdTopPageId} (patch)`, () => {
        return request(app.getHttpServer())
            .patch(`/top-page/${createdTopPageId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({ ...createDto, title: newTitle })
            .expect(HttpStatus.OK)
            .expect((response) => {
                expect(response.body.title).toEqual(newTitle); // Assert the response body as needed
            });
    });

    const findDto: FindTopPageDto = {
        firstCategory: TopLevelCategory.Courses,
    };

    it(`POST /top-page/find (find)`, () => {
        return request(app.getHttpServer())
            .post('/top-page/find')
            .send(findDto)
            .expect(HttpStatus.OK)
            .expect((response) => {
                expect(response.body.length).toBeGreaterThan(0); // Assert the response body as needed
            });
    });

    it(`GET /top-page/textSearch/:text (textSearch)`, () => {
        const searchText = 'PHP'; // Provide a search text

        return request(app.getHttpServer())
            .get(`/top-page/textSearch/${searchText}`)
            .expect(HttpStatus.OK)
            .expect((response) => {
                expect(response.body.length).toBeGreaterThan(0); // Assert the response body as needed
            });
    });

    it(`DELETE /top-page/${createdTopPageId} (delete)`, () => {
        console.log('createdTopPageId', createdTopPageId);
        return request(app.getHttpServer())
            .delete(`/top-page/${createdTopPageId}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(HttpStatus.OK);
    });
});
