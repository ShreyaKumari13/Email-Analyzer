import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema({
  timestamps: true,
})
export class Email {
  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  date: Date;

  @Prop({ type: Object })
  rawHeaders: Record<string, any>;

  @Prop({ type: [String] })
  receivingChain: string[];

  @Prop()
  espType: string;

  @Prop()
  espConfidence: number;

  @Prop()
  body: string;

  @Prop({ default: 'pending' })
  processingStatus: string;

  @Prop()
  error?: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);