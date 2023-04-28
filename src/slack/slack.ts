import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { ArgumentsHost } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';

@Catch()
@Injectable()
export class SlackExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof AxiosError
        ? (exception.response?.data as { error: string })?.error
        : 'Internal server error';

    response.status(status).json({
      message,
    });
  }
}

@Injectable()
@UseFilters(SlackExceptionFilter)
export class SlackService {
  constructor(private readonly configService: ConfigService) {}

  private readonly slackApiUrl = 'https://slack-error.slack.com/api'; // https://slack.com/api
  private readonly token = this.configService.get('SLACK_TOKEN'); //'YOUR_SLACK_API_TOKEN'

  async sendSlackMessage(channel: string, message: string) {
    try {
      const response = await axios.post(
        `${this.slackApiUrl}/chat.postMessage`,
        {
          channel: this.configService.get('SLACK_CHANNEL'),
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
