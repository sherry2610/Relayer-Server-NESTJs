import { Test, TestingModule } from '@nestjs/testing';
import { Cron } from './cron';

describe('Cron', () => {
  let provider: Cron;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cron],
    }).compile();

    provider = module.get<Cron>(Cron);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
