import React, { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import useConversation from '../zustand/useConversation'
import notificationSound from '../assets/sounds/notification.mp3'

const useListenMessages = () => {
    const {socket} = useSocketContext()

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play().catch(err => console.log('Sound failed:', err));
            
            // ✅ Get current state and update
            const currentMessages = useConversation.getState().messages;
            useConversation.getState().setMessages([...currentMessages, newMessage]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => socket.off("newMessage", handleNewMessage);
    }, [socket]);

}

export default useListenMessages