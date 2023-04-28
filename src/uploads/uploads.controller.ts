import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 4)) // 4는 최대파일개수
  async uploadFile(@UploadedFiles() files) {
    console.log(files);
    const imgurl = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const key = await this.uploadsService.uploadImage(file);
        imgurl.push(key);
        // imgurl.push(process.env.AWS_CLOUDFRONT + key);
      }),
    );

    return {
      statusCode: 201,
      message: `이미지 등록 성공`,
      data: imgurl,
    };
  }
}
