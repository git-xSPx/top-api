import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatedReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId();

const authDto: AuthDto = {
    login: 'aaa@dom.com',
    password: '123',
};

const testDto: CreatedReviewDto = {
    name: 'Test',
    title: 'Title',
    description: 'Test description',
    rating: 5,
    product: productId,
};

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
    let token = '';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { body } = await request(app.getHttpServer()).post('/auth/login').send(authDto);
        token = body.access_token;
    });

    it('/review/create (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send(testDto)
            .expect(201)
            .then(({ body }) => {
                createdId = body._id;
                expect(createdId).toBeDefined();
            });
    });

    it('/review/create (POST) - fail', async () => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send({ ...testDto, rating: 0 })
            .expect(400)
            .then(({ body }) => {
                console.log(body);
            });
    });

    it('/review/byProduct/:id (GET) - faild', async () => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + new Types.ObjectId().toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(0);
            });
    });

    it('/review/byProduct/:id (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + productId.toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(1);
            });
    });

    it('/review/:id (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

    it('/review/:id (DELETE) - faild', () => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: 404,
                message: REVIEW_NOT_FOUND,
            });
    });

    afterAll(() => {
        disconnect();
    });
});
