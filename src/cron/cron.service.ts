import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model,Collection } from 'mongoose';
import Web3 from 'web3';
import { TxRecord1, TxRecord2, TxRecord3 } from './cron.model';
// import * as mongoose from 'mongoose';
// import { TxRecord2 } from '../../dist/cron/cron.model';
import mongoose = require("mongoose");
let Tx = require('ethereumjs-tx').Transaction

let rpcUrl = 'http://localhost:8545'
let web3 = new Web3(rpcUrl)

const connectDB = async () => {
    const conn=await mongoose.connect(
        process.env.DB_CONNECTION_URL,
        {useUnifiedTopology:false,useNewUrlParser:true, useFindAndModify: false})
    console.log("connected to MONGO atlas!!!!",)
     return conn
  }

@Injectable()
export class CronService {

    constructor(
    @InjectModel('TxRecord1') private readonly txRecord1: Model<TxRecord1>,
    @InjectModel('TxRecord2') private readonly txRecord2: Model<TxRecord2>,
    @InjectModel('TxRecord3') private readonly txRecord3: Model<TxRecord3>,
    ) {}


    async resolver(){

        const r1 = (await this.txRecord1.find()).length
        console.log('count r1 ===',r1)

        const r2 = (await this.txRecord2.find()).length
        console.log('count r2 ===',r2)

        const r3 = (await this.txRecord3.find()).length
        console.log('count r3 ===',r3)

        var obj = { r1, r2, r3 }
        
        var biggest = '';
        for (var name in obj) {
            if(biggest !== '' && obj[name] < obj[biggest]) {
                biggest = name;
            } else if (biggest === '') {
                biggest = name;
            }
        }
        return biggest;
        

        // return Math.min(r1,r2,r3)
    }

    saveToR1(hash) {
        this.txRecord1.create({txHash:hash}).then(res=>{
            console.log("record ID",res)
        })
    }

    saveToR2(hash) {
        this.txRecord2.create({txHash:hash}).then(res=>{
            console.log("record ID",res)
        })
    }

    saveToR3(hash) {
        this.txRecord3.create({txHash:hash}).then(res=>{
            console.log("record ID",res)
        })
    }


    // @Cron('5 * * * * *')
    async getAllAccounts() {

        let web3 = new Web3(rpcUrl)
        const accounts = await web3.eth.getAccounts();

        const con = (await this.txRecord1.find()).length
        console.log('count ===',con)

        await this.resolver().then(res=>console.log("resolver return",res))



        
        return accounts
    }

    async getBalance(address: string) {
        let balance

        let web3 = new Web3(rpcUrl)

        await web3.eth.getBalance(address, (err, bal) => {
            console.log("in balance", bal)
            balance = web3.utils.fromWei(bal,'ether')
        })

        return {
            address,
            balance
        }
    }

    waitForReceipt(hash) {
        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
          if (err) {
            console.log("ERROR in getTxReceipt: ",err);
          }
      
          if (receipt !== null) {
            // Transaction went through
            console.log("receipt++++",receipt)
            // if (cb) {
            //   cb(receipt);
            // }
          }
        });
      }

      async sendingTx(from,privateKey,to,value){
          let TxHash
        await web3.eth.getTransactionCount(from, async (err, txCount) => {

            //Build the transaction obj
            let txObject = {
                'nonce': web3.utils.toHex(txCount),
                from: web3.utils.toHex(from),
                to: web3.utils.toHex(to),
                value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
                gasLimit: web3.utils.toHex('21000'),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
            }

            // // console.log("txObject", txObject)

            // //Sign the transaction
            let privateKey1 = Buffer.from(privateKey,'hex')
            let tx = new Tx(txObject, { chain: 'ropsten' })
            tx.sign(privateKey1)

            let serializedTransaction = tx.serialize()
            let raw = '0x' + serializedTransaction.toString('hex')

            // //Broadcast the transaction
            await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log("txHash : ", txHash)
                TxHash = txHash
            })

            console.log("TxHash ----",TxHash)

            let resolvedR
            await this.resolver().then(res=>{
                console.log("resolver return",res)
                resolvedR = res
            })

            switch(resolvedR){
                case 'r1':
                    console.log("r1 case")
                    this.saveToR1(TxHash);
                    break;
                case 'r2':
                    console.log("r2 case")
                    this.saveToR2(TxHash);
                    break;
                case 'r3':
                    console.log("r3 case")
                    this.saveToR3(TxHash);
                    break;
                default :
                    console.log("Nothing found!")
                    break
            }


            // tx details
            this.waitForReceipt(TxHash)
        })
      }

    async sendTx(from,privateKey,to,value) {       
        await this.sendingTx(from,privateKey,to,value)
    }

    async getPendingTx(){
        let web3 = new Web3(rpcUrl)
        console.log("++++")

        await web3.eth.getPendingTransactions().then(res=>console.log("abc"))
    }
}
