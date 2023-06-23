import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const authDto: AuthDto = {
    login: 'aaa@dom.com',
    password: '123',
};

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(authDto)
            .expect(200)
            .then(({ body }) => {
                const token = body.access_token;
                expect(token).toBeDefined();
            });
    });

    it('/auth/login (POST) - faild password', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...authDto, password: '' })
            .expect(401, {
                statusCode: 401,
                message: 'Wrong password!',
                error: 'Unauthorized',
            });
    });

    it('/auth/login (POST) - faild login', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...authDto, login: 'bbb@dom.com' })
            .expect(401, {
                statusCode: 401,
                message: 'The user not found!',
                error: 'Unauthorized',
            });
    });

    afterAll(() => {
        disconnect();
    });
});
