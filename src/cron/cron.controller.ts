import { Body, Controller, Get, Param } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
    constructor(private readonly appService: CronService) {}

    @Get('accounts')
    getHello(){
      return this.appService.getAllAccounts();
    }

    @Get('accounts/:id')
    getBalancebyAccount(
      @Param('id') id: string
    ){
      console.log('address',id)
      return this.appService.getBalance(id);
    }

    @Get('accounts/pendingTx')
    getPendingTx(
      // @Param('id') id: string
    ){
      return this.appService.getPendingTx();
    }

    

    @Get('sendTx')
    sendTransaction(
      @Body('from') from: string,
      @Body('to') to: string,
      @Body('key') key: string,
      @Body('value') value: string,
    ){
      console.log('address',{from,value,to})
      return this.appService.sendTx(from,key,to,value);
    }
}
