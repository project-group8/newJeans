import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SplitCardsDto } from '../src/cardposts/dto/cardposts.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // add this line1
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/postCards', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/postCards')
      .query({
        category: 'your-category',
        maincategory: 'your-maincategory',
        splitNumber: 1,
        splitPageNumber: 1,
      })
      .expect(200);

    expect(response.body.postCards).toBeDefined();
  });

  it('/api/postCards/hotPostCard', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/postCards/hotPostCard')
      .expect(200);

    expect(response.body.postCards).toBeDefined();
  });

  it('/api/postCards/:postIdx', async () => {
    const fakeToken = {
      sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
    };
    const fakePostIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
    const response = await request(app.getHttpServer())
      .get(`/api/postCards/post/${fakePostIdx}`)
      .set('Authorization', `Bearer ${fakeToken}`) // assuming you're using bearer token authentication
      .expect(200);

    expect(response.body.post).toBeDefined();
  });
});
