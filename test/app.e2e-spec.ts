import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  CreateCardDto,
  SplitCardsDto,
} from '../src/cardposts/dto/cardposts.dto';

jest.mock('../src/auth/jwt/jwt.guard', () => ({
  JwtAuthGuard: jest.fn(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

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
    const fakePostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';
    const response = await request(app.getHttpServer())
      .get(`/api/postCards/post/${fakePostIdx}`)
      .set('Authorization', `Bearer ${fakeToken.sub}`) // assuming you're using bearer token authentication
      .expect(200);

    expect(response.body.post).toBeDefined();
  });

  it('/api/postCards/post/contents/:postIdx', async () => {
    const fakeToken = {
      sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
    };
    const fakePostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';
    const response = await request(app.getHttpServer())
      .get(`/api/postCards/post/contents/${fakePostIdx}`)
      .set('Authorization', `Bearer ${fakeToken.sub}`)
      .expect(200);

    expect(response.body.contents).toBeDefined();
  });

  it('/api/postCards/post/category/:postIdx', async () => {
    const fakePostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';

    const response = await request(app.getHttpServer())
      .get(`/api/postCards/post/category/${fakePostIdx}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/api/postCards/post/createPost', async () => {
    const fakeToken = {
      sub: '3cffe849-7987-4369-b1d1-0961ee5efe82' as `${string}-${string}-${string}-${string}-${string}`,
    };
    const createCardDto = {
      title: '안녕하세요 타이틀 입니다.',
      maincategory: '진지',
      category: '스포츠',
      desc: '나는왜 desc를 만드는데 20글자가 필요한지 정말 모르겠다 그냥 아무렇게나 허용해 주면 안되나?',
      pollType: '모름',
      pollTitle: '왜 타이틀도 제한을 둔걸꺼?',
      tag: null,
      imgUrl: null,
    };

    return request(app.getHttpServer())
      .post('/api/postCards/post/createPost')
      .set('Authorization', `Bearer ${fakeToken.sub}`)
      .field('createCardDto', JSON.stringify(createCardDto))
      .attach('files', Buffer.from([]), 'filename.txt')
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body.msg).toEqual('포스트 작성에 성공했습니다.');
      });
  });
});
