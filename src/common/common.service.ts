import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  generateRandomKey(length = 16) {
    // Define characters that can be used in the key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let key = '';
  
    // Generate a random key of the specified length
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters[randomIndex];
    }
  
    return key;
  }

  async uploadFile(file) {
    const { originalname } = file;
    // uplaod file to S3
    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      `${this.generateRandomKey()}.${originalname.substr(originalname.lastIndexOf('.') + 1)}`,
      file.mimetype,
    );
  }

  async deleteFile(name: string) {
    var params = { Bucket: this.AWS_S3_BUCKET, Key: name };
    // delete s3 object
    const s3Response = this.s3.deleteObject(params).promise();
    return s3Response;
  }

  async generatePresignedUrl(objectKey) {
    // Define the parameters for generating the pre-signed URL
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: `${objectKey}`,
      Expires: 172800, // URL expiration time in seconds
    };
  
    // Generate the pre-signed URL
    const url = this.s3.getSignedUrl('getObject', params);
  
    return url;
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      await this.s3.upload(params).promise();
      console.log(name)
      return name;
    } catch (e) {
      console.log(e);
    }
  }

  // bcypt utils
  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  verifyHashPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  // common success response
  customSuccessResponse(data: any, message: string, status: number) {
    return {data, message, error: null, status}
  }
}
