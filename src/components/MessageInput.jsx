import { useState } from "react";
import { BsSend, BsX } from "react-icons/bs";
import axios from "axios";
import { HiOutlinePaperClip } from "react-icons/hi";

const MessageInput = ({ addMessage, receiverId }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      document.getElementById("my_modal_1").showModal(); // Open modal when file is selected
    }
  };

  const closeModal = () => {
    setMessage("");
    setFile(null);
    document.getElementById("my_modal_1").close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // Don't submit if both are empty

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /* Replace with your API endpoint to send a message*/
      const response = await axios.post(
        `https://chat-app-backend-k80s.onrender.com/api/messages/send/${receiverId}`,
        {message},
        { headers }
      );

      // Assuming the response contains the newly added message
      const newMessage = response.data.newMessage;

      // Call addMessage function to update messages in parent component
      addMessage(newMessage);

      // Clear input and close the modal after sending
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const uploadFile = async (file) => {
    let fileType = file.type.split('/')[0];
    let upload_preset = "";
    if (fileType === "image") {
      upload_preset = "images";
    } else if (fileType === "video") {
      upload_preset = "videos";
    } else {
      upload_preset = "others";
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData,
      );
      const {secure_url} = response.data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const fileUrl = await uploadFile(file);
      await axios.post(
        `https://chat-app-backend-k80s.onrender.com/api/messages/send/${receiverId}`,
        {message, fileUrl},
        { headers }
      );
      
      closeModal();
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  return (
    <div className="bg-base-300 rounded p-1">
      <form className="px-4 my-3" onSubmit={handleSubmit}>
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered flex-grow"
            value={message}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 p-2 text-2xl btn btn-secondary"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <HiOutlinePaperClip />
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>
          <button type="submit" className="ml-2 p-2 text-2xl btn btn-secondary">
            <BsSend />
          </button>
        </div>
      </form>

      {/* Modal for file confirmation */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box relative">
          {/* Close button at the top-right corner */}
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2 text-2xl"
            onClick={closeModal}
          >
            <BsX />
          </button>
          <h3 className="font-bold text-lg">File Selected</h3>
          {file && (
            <div className="py-4">
              <img
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="w-full h-auto mb-4"
              />
              <input
                type="text"
                placeholder="Add a caption"
                className="input input-bordered w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          )}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-secondary"
              onClick={handleFileSubmit}
            >
              <BsSend className="text-2xl" />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MessageInput;
