import { Injectable, NestMiddleware } from '@nestjs/common';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class UploadFileMiddleware implements NestMiddleware {
  constructor(private uploadsService: UploadsService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const files = req.file as Express.Multer.File[];
    const imgurl = [];

    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const key = await this.uploadsService.uploadImage(file);
        imgurl.push(key);
      }),
    );

    req.body.imgurl = imgurl;
  }
}
