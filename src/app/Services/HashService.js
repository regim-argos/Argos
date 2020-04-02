import crypto from 'crypto';
import BadRequestError from '../Error/BadRequestError';
import Hash from '../models/Hash';
// import HashValidator from '../Validators/MealValidator';
// import { notFound } from '../Error/TypeErrors';
// import ProductService from './ProductService';

class HashServices {
  constructor() {
    this.model = Hash;
  }

  async verifyAndGetHash(hash, type) {
    const hashDb = await this.model.getHashByHash(hash, type);
    if (!hashDb) throw new BadRequestError('Invalid token');
    return hashDb;
  }

  async create(userId, type = 'CONFIRM_EMAIL') {
    // const ValidatedHash = await HashValidator.createValidator(data);

    const payload = {
      type,
      hash: crypto.randomBytes(40).toString('hex'),
    };

    const hash = await this.model.createHash(payload, userId);
    return hash;
  }

  async delete(id) {
    const deleteds = await this.model.deleteHashById(id);
    if (!deleteds === 0) throw new BadRequestError('Invalid token');
    return true;
  }
}

export default new HashServices();
