import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const VOICE_EN = '21m00Tcm4TlvDq8ikWAM'; // Rachel — warm English voice
const VOICE_HE = 'XB0fDUnXU5powFXDhCwa'; // Charlotte — best Hebrew pronunciation

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

    // Use eleven_v3 + Charlotte for Hebrew, eleven_multilingual_v2 + Rachel for English
    const isHebrew = lang === 'he';
    const voiceId = isHebrew ? VOICE_HE : VOICE_EN;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
    const body: Record<string, unknown> = {
      text,
      model_id: isHebrew ? 'eleven_v3' : 'eleven_multilingual_v2',
      voice_settings: isHebrew
        ? { stability: 0.5, similarity_boost: 0.8, speed: 0.9 }
        : { stability: 0.6, similarity_boost: 0.8, style: 0.3, speed: 0.9 },
    };

    if (isHebrew) {
      body.language_code = 'he';
    }

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
