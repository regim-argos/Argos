/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import crypto from 'crypto';
import S3 from 'aws-sdk/clients/s3';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { extname, resolve } from 'path';
import BadRequestError from '../app/Error/BadRequestError';

aws.config.update({
  region: process.env.AWS_S3_REGION,
});

const s3 = new S3();
const fileName = (file: any, cb: any) => {
  crypto.randomBytes(16, (err, res) => {
    if (err) return cb(err);

    return cb(null, res.toString('hex') + extname(file.originalname));
  });
};
const storage =
  process.env.NODE_ENV === 'production'
    ? multerS3({
        s3,
        acl: 'public-read',
        bucket: 'argos-image',
        key(req: any, file: any, cb: any) {
          fileName(file, cb);
        },
      })
    : multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req: any, file: any, cb: any) => {
          fileName(file, cb);
        },
      });

export default {
  limits: { fileSize: 3 * 1000 * 1000 },
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
      (format) => format === file.mimetype
    );
    if (!isAccepted) cb(new BadRequestError('Format invalid'));

    return cb(null, true);
  },
};
