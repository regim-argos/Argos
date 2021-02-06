import 'dotenv/config';

// import './tracer';

import './database';
import ConfirmEmail from '@app/jobs/ConfirmEmail';
import Rabbit from '@lib/Rabbit';
import DiscordNotification from '@app/jobs/DiscordNotification';
import ForgetPassword from '@app/jobs/ForgetPassword';
import NewMemberEmail from '@app/jobs/NewMemberEmail';
import SlackNotification from '@app/jobs/SlackNotification';
import Watcher from '@app/jobs/Watcher';

Rabbit.CreatConsumer('discord-notification', DiscordNotification, 1000);
Rabbit.CreatConsumer('slack-notification', SlackNotification, 1000);
Rabbit.CreatConsumer('confirm-email', ConfirmEmail, 20000);
Rabbit.CreatConsumer('forget-password', ForgetPassword, 20000);
Rabbit.CreatConsumer('new-member', NewMemberEmail, 20000);
Rabbit.CreatConsumer('watcher', Watcher, 15000);
