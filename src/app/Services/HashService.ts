import crypto from 'crypto';
import BadRequestError from '../Error/BadRequestError';
import Hash from '../data/models/Hash';
// import HashValidator from '../Validators/MealValidator';
// import { notFound } from '../Error/TypeErrors';

class HashServices {
  protected model = Hash;

  async verifyAndGetHash(hash: string, type: string) {
    const hashDb = await this.model.getHashByHash(hash, type);
    if (!hashDb) throw new BadRequestError('Invalid token');
    return hashDb;
  }

  async create(
    userId: number,
    type: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD' = 'CONFIRM_EMAIL'
  ) {
    // const ValidatedHash = await HashValidator.createValidator(data);

    const payload = {
      type,
      hash: crypto.randomBytes(40).toString('hex'),
    };

    const hash = await this.model.createHash(payload, userId);
    return hash;
  }

  async delete(userId: number, type: string) {
    await this.model.deleteHashByUserIdAndType(userId, type);
    return true;
  }
}

export default new HashServices();
