import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TtsService } from './tts.service';
import { SpeakDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('tts')
export class TtsController {
  constructor(private ttsService: TtsService) {}

  @Post('speak')
  async speak(@Body() dto: SpeakDto, @Res() res: Response) {
    const stream = await this.ttsService.synthesize(dto.text, dto.lang);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    });

    // Pipe the ElevenLabs stream directly to the client
    const reader = (stream as any);
    if (reader.pipe) {
      reader.pipe(res);
    } else {
      // Web ReadableStream (Node 18+ fetch)
      const webStream = stream as unknown as ReadableStream<Uint8Array>;
      const nodeReader = webStream.getReader();
      async function pump() {
        const { done, value } = await nodeReader.read();
        if (done) { res.end(); return; }
        res.write(value);
        await pump();
      }
      await pump();
    }
  }
}
