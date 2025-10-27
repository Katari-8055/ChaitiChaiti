import mongoose,{Document, Schema} from "mongoose";


export interface IChat extends Document{
    user: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const schema: Schema<IChat> = new  Schema({
    user: [{type: String, required: true}],
    latestMessage: {
        text: String,
        sender: String
    }
},{
    timestamps: true
})

export const Chat = mongoose.model<IChat>('Chat', schema);