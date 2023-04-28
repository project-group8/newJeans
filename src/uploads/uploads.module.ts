import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UploadFileMiddleware } from 'src/middleware/uploads.middleware';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadFileMiddleware).forRoutes('/post/createPost');
  }
}
