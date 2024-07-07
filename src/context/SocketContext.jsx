import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import {jwtDecode} from "jwt-decode";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);

            const socket = io("http://localhost:8000", {
                query: {
                    userId: decodedToken.userId,
                },
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, userId }}>
            {children}
        </SocketContext.Provider>
    );
};
