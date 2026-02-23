import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel — warm, multilingual

@Injectable()
export class TtsService {
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('ELEVENLABS_API_KEY', '');
  }

  async synthesize(text: string, lang: 'en' | 'he'): Promise<NodeJS.ReadableStream> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TTS not configured');
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

    const body: Record<string, unknown> = {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.3,
        speed: 0.9,
      },
    };

    // Multilingual v2 auto-detects language from text — no language_code needed

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new ServiceUnavailableException('ElevenLabs unreachable');
    }

    if (!res.ok) {
      throw new ServiceUnavailableException('ElevenLabs error');
    }

    return res.body as unknown as NodeJS.ReadableStream;
  }
}
