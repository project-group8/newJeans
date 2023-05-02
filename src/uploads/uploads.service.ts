import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  private readonly awsS3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }
  async uploadFileToS3(files: Array<Express.Multer.File>) {
    try {
      const uploadPromises = files.map((file: Express.Multer.File) => {
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        };
        return this.awsS3.upload(params).promise();
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }
}
