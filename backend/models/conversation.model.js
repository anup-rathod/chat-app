 import mongoose from "mongoose";

 const conversationSchema = new mongoose.Schema(
    {
        // Stores userIds in this array
        participants: [
            {   
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // Stores messageIds in this array
        messages: [
            {   
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
    },
    { timestamps: true }
 );

 const  Conversation = mongoose.model("Conversation", conversationSchema);

 export default Conversation;