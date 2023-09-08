import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {type: String, unique: true, required: true},
  purchase_datetime: {type: Date, default: Date.now},
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true},
});

mongoose.set('strictQuery', false)
const ticketModel = mongoose.model('Ticket', ticketSchema);

export default ticketModel;