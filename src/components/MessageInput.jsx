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
        `http://localhost:8000/api/messages/send/${receiverId}`,
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
          placeholder="Type here"
          className="input input-bordered w-full"
          value={message}
          name='message'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
        >
          <BsSend />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
