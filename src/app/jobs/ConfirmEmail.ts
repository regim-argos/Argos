import Mail from '../../lib/Mail';
import { IWorkerController } from './IWorkerController';

interface ConfirmEmailData {
  name: string;
  email: string;
  hash: string;
}
class ConfirmEmail implements IWorkerController {
  get key() {
    return 'ConfirmEmail';
  }

  async handle(data: ConfirmEmailData) {
    const { name, email, hash } = data;

    await Mail.sendMail({
      to: `${name} <${email}`,
      subject: 'Email Confirmation',
      template: 'confirmEmail',
      context: {
        userName: name,
        link: `${process.env.CONFIRM_EMAIL_LINK}/${hash}`,
      },
    });
  }
}

export default new ConfirmEmail();
