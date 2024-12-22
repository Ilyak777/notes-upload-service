import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ExternalSpellCheckService {
  private readonly apiUrl = 'https://рандомный_урлик/api/check';
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 5000,
    });
  }

  private hashRequestData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async checkSpell(content: string): Promise<boolean> {
    try {
      const hash = this.hashRequestData(content);

      const response = await this.httpClient.post(
        '',
        { text: content },
        {
          headers: {
            'x-hash': hash,
          },
        },
      );

      if (typeof response.data?.isValid !== 'boolean') {
        throw new HttpException(
          'Unexpected response format from external service',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data.isValid;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Error calling external service: ${error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }
      throw new HttpException(
        'Unexpected error during spell check',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
