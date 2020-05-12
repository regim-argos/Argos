import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
// @ts-ignore
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import SES from 'aws-sdk/clients/ses';
import MailNodemailer from 'nodemailer/lib/mailer';
import mailConfig from '../config/mail';

interface ArgosMail extends MailNodemailer.Options {
  template: string;
  context: {
    userName: string;
    link: string;
  };
}
class Mail {
  protected transporter = nodemailer.createTransport({
    SES: new SES({
      apiVersion: '2010-12-01',
      region: 'us-east-1',
    }),
  });

  constructor() {
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message: ArgosMail) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
