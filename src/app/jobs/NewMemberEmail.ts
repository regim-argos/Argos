import Mail from '../../lib/Mail';

interface NewMemberEmailData {
  data: {
    name: string;
    projectName: string;
    email: string;
  };
}
class NewMemberEmail {
  get key() {
    return 'NewMemberEmail';
  }

  async handle({ data }: NewMemberEmailData) {
    const { name, email, projectName } = data;

    await Mail.sendMail({
      to: `${email}`,
      subject: `${name} quer que você faça parte de ${projectName}`,
      template: 'newMember',
      context: {
        userName: name,
        projectName,
      },
    });
  }
}

export default new NewMemberEmail();
