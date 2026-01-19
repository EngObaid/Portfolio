import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
