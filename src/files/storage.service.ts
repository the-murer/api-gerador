import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { generateId } from '@app/utils/database/schema-utils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

export const cache = new Keyv({
  store: new KeyvFile({
    filename: './cache.json',
  }),
  ttl: 1000 * 60 * 15,
});
@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get('AWS_S3_BUCKET')!;
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  public getBucket(): string {
    return this.bucket;
  }

  public async uploadFile(
    file: Buffer,
    extension: string = '.jpg',
    mimeType: string = 'image/jpeg',
  ) {
    const key = `${generateId()}-${Date.now()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return key;
  }

  public async getFileUrl(key: string, expiresIn: number = 1000 * 60 * 15) {
    const cached = await cache.get(key);
    if (cached) return cached;

    console.log('Not-cached');
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      { expiresIn },
    );
    await cache.set(key, url);

    return url;
  }

  public async deleteFile(key: string) {
    const response = await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return response;
  }
}
