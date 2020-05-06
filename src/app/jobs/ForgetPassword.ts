import Mail from '../../lib/Mail';

class ForgetPassword {
  get key() {
    return 'ForgetPassword';
  }

  async handle({ data }) {
    const { name, email, hash } = data;

    await Mail.sendMail({
      to: `${name} <${email}`,
      subject: 'Email de recuperação de senha',
      template: 'changePassword',
      context: {
        userName: name,
        link: `${process.env.FORGET_PASSWORD_LINK}/${hash}`,
      },
    });
  }
}

export default new ForgetPassword();
