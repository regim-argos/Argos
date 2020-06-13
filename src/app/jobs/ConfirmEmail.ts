import Mail from '../../lib/Mail';

interface ConfirmEmailData {
  data: {
    name: string;
    email: string;
    hash: string;
  };
}
class ConfirmEmail {
  get key() {
    return 'ConfirmEmail';
  }

  async handle({ data }: ConfirmEmailData) {
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
