import { Injectable } from '@nestjs/common';
import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ArgumentsHost } from '@nestjs/common';
import { SlackService } from './slack.config';
import { Namespace, Server } from 'socket.io';

@Catch()
@Injectable()
export class SlackExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception?.response?.status ||
      exception.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception?.response?.data as { error: string })?.error ||
      exception.message ||
      'Internal server error';

    await this.slackService.sendSlackMessage(`Error: ${message}`);

    response.status(status).json({
      message,
    });
  }
}
