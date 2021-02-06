import Mail from '../../lib/Mail';
import { IWorkerController } from './IWorkerController';

interface ForgetPasswordEmailData {
  name: string;
  email: string;
  hash: string;
}
class ForgetPassword implements IWorkerController {
  get key() {
    return 'ForgetPassword';
  }

  async handle(data: ForgetPasswordEmailData) {
    const { name, email, hash } = data;

    await Mail.sendMail({
      to: `${name} <${email}`,
      subject: 'Password recovery',
      template: 'changePassword',
      context: {
        userName: name,
        link: `${process.env.FORGET_PASSWORD_LINK}/${hash}`,
      },
    });
  }
}

export default new ForgetPassword();
