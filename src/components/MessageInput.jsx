import { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import axios from 'axios';

const MessageInput = ({ addMessage, receiverId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Replace with your API endpoint to send a message
      const response = await axios.post(
        `https://chat-app-backend-k80s.onrender.com/api/messages/send/${receiverId}`,
        { message },
        { headers }
      );

      // Assuming the response contains the newly added message
      const newMessage = response.data.newMessage;

      // Call addMessage function to update messages in parent component
      addMessage(newMessage);

      // Clear message input after sending
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="send message ...."
          className="input input-bordered flex-grow"
          value={message}
          name='message'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 p-2 text-2xl btn btn-secondary rounded-full"
        >
          <BsSend />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
