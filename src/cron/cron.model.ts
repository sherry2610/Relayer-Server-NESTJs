import * as mongoose from 'mongoose'


export const TxRecordSchema = new mongoose.Schema({
    txHash: {type: String, required: true},
})

export interface TxRecord1 extends mongoose.Document {
    txHash: string
}

export interface TxRecord2 extends mongoose.Document {
    txHash: string
}

export interface TxRecord3 extends mongoose.Document {
    txHash: string
}
