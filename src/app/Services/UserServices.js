import User from '../models/User';
import HashService from './HashService';
import UserValidator from '../Validators/UserValidator';
import Queue from '../../lib/Queue';
import ConfirmEmail from '../jobs/ConfirmEmail';
import ForgetPassword from '../jobs/ForgetPassword';
import NotFoundError from '../Error/NotFoundError';
import BadRequestError from '../Error/BadRequestError';
import FileService from './FileService';

class UserServices {
  constructor() {
    this.model = User;
  }

  async confirmEmail(hash) {
    const hashDb = await HashService.verifyAndGetHash(hash, 'CONFIRM_EMAIL');
    await this.model.update({ active: true }, hashDb.user_id);
    await HashService.delete(hashDb.id);
  }

  async forgetPassword(hash, data) {
    const { password } = await UserValidator.updatePassword(data);
    const hashDb = await HashService.verifyAndGetHash(hash, 'CHANGE_PASSWORD');

    await this.model.update({ password }, hashDb.user_id);
    await HashService.delete(hashDb.id);
  }

  async verifyAndGetUserByEmail(email) {
    const user = await this.model.getUserByEmail(email);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async verifyAndGetUserById(id) {
    const user = await this.model.getUserById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async verifyIfUniqueEmail(email) {
    const user = await this.model.getUserByEmail(email);
    if (user) throw new BadRequestError('User already exists');
    return user;
  }

  async createForgetPasswordHash(email) {
    if (!email) throw new BadRequestError('Email is required');
    const { id, name, active } = await this.verifyAndGetUserByEmail(email);
    if (!active) throw new BadRequestError('Email need confirmed');

    const { hash } = await HashService.create(id, 'CHANGE_PASSWORD');
    await Queue.add(ForgetPassword.key, { name, email, hash });
  }

  async createConfirmEmailHash(email, user) {
    const { id, name, active } =
      user || (await this.verifyAndGetUserByEmail(email));
    if (active) throw new BadRequestError('Email already confirmed');
    const { hash } = await HashService.create(id);

    await Queue.add(ConfirmEmail.key, { name, email, hash });
  }

  async create(data) {
    const ValidatedUser = await UserValidator.createValidator(data);

    await this.verifyIfUniqueEmail(ValidatedUser.email);

    const user = await this.model.create(ValidatedUser);

    await this.createConfirmEmailHash(user.email, user);

    return user;
  }

  async update(data, userId) {
    const ValidatedUser = await UserValidator.updateValidator(data);

    const { oldPassword } = ValidatedUser;

    const user = await this.verifyAndGetUserById(userId);
    if (ValidatedUser.imageId)
      await FileService.verifyAndGetFile(ValidatedUser.imageId, userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw new BadRequestError('Password does not match');
    }

    await this.model.update(ValidatedUser, userId);

    const userSaved = await this.verifyAndGetUserById(userId);

    return userSaved;
  }
}

export default new UserServices();
