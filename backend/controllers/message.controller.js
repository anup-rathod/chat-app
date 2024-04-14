import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;   //=> Getting message from user as an input 
        const { id: receiverId } = req.params; //we get the user id or receiverId from params as name has been changed as alias.
        const senderId = req.user._id;  //we get from user id from protectRoute

        // Find conversation b/w this two users
        let conversation = await Conversation.findOne({
            participants: { $all: [ senderId, receiverId ] },
        })

        //if not exist we create one
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [ senderId, receiverId ],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })
        //put this messages into messages array
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await message.save();

        // OPTIMIZED WAY => this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        //SOCKET IO FUNCTIONALITY GOES HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            // io.to(<socket._id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error occured in sendMessage Controller", error.message)
        res.status(500).json({ error: "Internal Server Error" });
    } 
}; 


export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all : [ senderId, userToChatId ]} ,
        }).populate("messages")  //=> NOT REFERENCE BUT ACTUAL MESSAGES give msg one by one

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}