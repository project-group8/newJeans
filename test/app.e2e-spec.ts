import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

let useMock = true;
jest.mock('../src/auth/jwt/jwt.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockImplementation((context) => {
      if (useMock) {
        const req = context.switchToHttp().getRequest();
        req.user = {
          sub: 'd87f78c5-7e86-44d7-a065-d994668d5e84' as `${string}-${string}-${string}-${string}-${string}`,
        };
        return true;
      }
    }),
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
      // .set('Authorization', `Bearer ${fakeToken.sub}`) // assuming you're using bearer token authentication
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

  it('/api/postCards/post/createPost', () => {
    const createCardDto = {
      title: 'Test Title',
      maincategory: 'TestCategory',
      category: 'SubCategory',
      desc: 'Test Description',
      pollType: 'Test Poll Type',
      pollTitle: 'Test Poll Title',
      tag: 'TestTag',
      imgUrl: 'https://example.com/test.jpg',
    };

    const payload = {
      sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
    };

    return request(app.getHttpServer())
      .post('/api/postCards/post/createPost')
      .set('Authorization', `Bearer ${payload.sub}`)
      .attach('files', Buffer.from([]), 'filename.txt')
      .field(createCardDto)
      .expect(201)
      .expect({ msg: '포스트 작성에 성공했습니다.' });
  });

  it('/api/postCards/post/createPost/:postIdx', async () => {
    const mockPostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';
    const payload = {
      sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
    };
    const createCardDto = {
      title: 'Test Title',
      maincategory: 'TestCategory',
      category: 'SubCategory',
      desc: 'Test Description',
      pollType: 'Test Poll Type',
      pollTitle: 'Test Poll Title',
      tag: 'TestTag',
      imgUrl: 'https://example.com/test.jpg',
    };

    return request(app.getHttpServer())
      .put(`/api/postCards/post/createPost/${mockPostIdx}`)
      .set('Authorization', `Bearer ${payload.sub}`)
      .attach('files', Buffer.from([]), 'filename.txt')
      .field(createCardDto)
      .expect(200)
      .expect({ msg: '게시글 수정에 성공했습니다.' });
  });

  it('/api/postCards/post/createPost/:postIdx', async () => {
    const mockPostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';
    const payload = {
      sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
    };

    return request(app.getHttpServer())
      .delete(`/api/postCards/post/createPost/${mockPostIdx}`)
      .set('Authorization', `Bearer ${payload.sub}`)
      .expect(200)
      .expect({ msg: '게시글 삭제에 성공했습니다.' });
  });

  it('/api/postCards/post/imgs/:postIdx', async () => {
    const mockPostIdx = '02dbb646-7eb0-49d0-8fe4-d1017e81b6b9';
    const findImg: string[] = [];
    return request(app.getHttpServer())
      .get(`/api/postCards/post/imgs/${mockPostIdx}`)
      .expect(200)
      .expect({ imgs: findImg });
  });
});
