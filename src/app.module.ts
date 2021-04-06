import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
import { CronController } from './cron/cron.controller';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Cron } from './cron';
import { TxRecordSchema } from './cron/cron.model';

@Module({
  imports: [
    CronModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.xzcsa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    MongooseModule.forFeature([
      {name: 'TxRecord1', schema: TxRecordSchema},
      {name: 'TxRecord2', schema: TxRecordSchema},
      {name: 'TxRecord3', schema: TxRecordSchema}
    ])
  ],
  controllers: [AppController, CronController],
  providers: [AppService, CronService, Cron],
})
export class AppModule {}
