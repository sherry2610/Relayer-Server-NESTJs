import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { TxRecordSchema } from './cron.model';

@Module({
    imports: [
        CronModule,
        MongooseModule.forFeature([
            {name: 'TxRecord1', schema: TxRecordSchema},
            {name: 'TxRecord2', schema: TxRecordSchema},
            {name: 'TxRecord3', schema: TxRecordSchema}
        ])
    ],
    controllers: [CronController],
    providers: [CronService]
})

export class CronModule {}
