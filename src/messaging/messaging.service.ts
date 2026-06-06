import { AiService } from '@app/ai/services/ai.service';
import type { EnvConfig } from '@app/app/env.validations';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class MessagingService {
  private readonly client: Twilio;
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly whatsappNumber: string;

  constructor(
    private readonly aiService: AiService,
    private readonly configService: EnvConfig,
  ) {
    this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    this.authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.whatsappNumber = this.configService.get('TWILIO_PHONE_NUMBER');

    this.client = new Twilio(this.accountSid, this.authToken);
  }

  async sendMessage(to: string, message: string) {
    return this.client.messages.create({
      from: `whatsapp:${this.whatsappNumber}`,
      to: `whatsapp:${to}`,
      body: message,
    });
  }

  async messageReceiver(message: CallbackDto) {
    if (message.SmsStatus !== 'received') return;

    const { Body, From, MediaUrl0 } = message;

    let body = Body;
    if (MediaUrl0) {
      const response = await fetch(MediaUrl0, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.accountSid}:${this.authToken}`,
          ).toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio: ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      body = await this.aiService.transcribeAudio(audioBuffer);
    }

    return {
      senderName: message.ProfileName,
      body,
      from: message.WaId,
    };
  }
}

type CallbackDto = {
  SmsMessageSid: string;
  NumMedia: string;
  ProfileName: string;
  MessageType: string;
  SmsSid: string;
  WaId: string;
  SmsStatus: string;
  Body: string;
  To: string;
  NumSegments: string;
  ReferralNumMedia: string;
  MessageSid: string;
  AccountSid: string;
  ChannelMetadata: string;
  From: string;
  ApiVersion: string;
  MediaUrl0?: string;
};

const examplePayload = {
  SmsMessageSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  NumMedia: '0',
  ProfileName: 'Bruno Murer',
  MessageType: 'text',
  SmsSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  WaId: '554984260734',
  SmsStatus: 'received',
  Body: 'teste',
  To: 'whatsapp:+14155238886',
  NumSegments: '1',
  ReferralNumMedia: '0',
  MessageSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  AccountSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  ChannelMetadata:
    '{"type":"whatsapp","data":{"context":{"ProfileName":"Bruno Murer","WaId":"554984260734"}}}',
  From: 'whatsapp:+554984260734',
  ApiVersion: '2010-04-01',
  MediaUrl0:
    'https://api.twilio.com/2010-04-01/Accounts/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Media/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};
