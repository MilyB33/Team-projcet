import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimeEntriesService } from './timeEntries.service';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class TimeEntryListener {
  private readonly logger = new Logger(TimeEntryListener.name);

  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  // @Cron('0 */10 * * * *')
  // async checkTimeEntries() {
  //   this.logger.log('Checking time entries older than 9 hours...');

  //   const timeEntries =
  //     await this.timeEntriesService.findUnfinishedEntriesStartedNineHoursAgo();

  //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  //   const recipients = timeEntries.map((timeEntry) => {
  //     return timeEntry.projectUser.user.email;
  //   });

  //   const msg = {
  //     to: recipients,
  //     from: process.env.SENDGIRD_SENDER,
  //     subject: `Hi! Your clock is still running!`,
  //     text: `Your clock is still running! You can turn it of here ${process.env.APP_URL}`,
  //     html: `Your clock is still running! You can turn it of here ${process.env.APP_URL}`,
  //   };

  //   sgMail
  //     .send(msg)
  //     .then(() => console.log('Emails sent successfully'))
  //     .catch((error) => console.error('Error sending emails:', error));
  // }
}
