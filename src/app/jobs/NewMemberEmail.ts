import Mail from '../../lib/Mail';
import { IWorkerController } from './IWorkerController';

interface NewMemberEmailData {
  name: string;
  projectName: string;
  email: string;
}
class NewMemberEmail implements IWorkerController {
  get key() {
    return 'NewMemberEmail';
  }

  async handle(data: NewMemberEmailData) {
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
