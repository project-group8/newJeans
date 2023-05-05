import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackService {
  constructor(private readonly configService: ConfigService) {}

  private readonly slackApiUrl = 'https://slack-error.slack.com/api'; // https://slack.com/api
  private readonly token = this.configService.get('SLACK_TOKEN'); //'YOUR_SLACK_API_TOKEN'

  async sendSlackMessage(message: string) {
    const channel = this.configService.get('SLACK_CHANNEL');

    const errorMessage = 'Error: Cannot GET /socket.io/?EIO=4&transport';

    const DisconnecterrorMessage = 'Error: Cannot GET /ws';
    const noaddmessage = 'Error: Cannot GET /';
    // Socket.IO 통신 관련 에러를 확인하고 무시합니다.
    if (
      message.includes(errorMessage) ||
      message.includes(DisconnecterrorMessage) ||
      message === noaddmessage
    ) {
      return;
    }

    try {
      const response = await axios.post(
        `${this.slackApiUrl}/chat.postMessage`,
        {
          channel: channel,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-type': 'application/json',
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
}
