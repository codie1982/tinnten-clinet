// hooks/useAgentSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useAuth } from '../../context/authContext';
const SOCKET_URL = 'http://localhost:5001'; // production'da HTTPS olacaksa 'https://domain.com'

export default function useAgentSocket() {
    const [feedbackList, setFeedbackList] = useState([]);
    const { isLogin, userid } = useAuth();
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            secure: SOCKET_URL.startsWith('https'),
        });

        socket.on('connect', () => {
            console.log('Socket bağlantısı kuruldu:', socket.id);
            if (isLogin) {
                socket.emit('identify', { userid }); // Kullanıcı kimliğini gönder
            }
        });

        socket.on('agent-feedback', (data) => {
            console.log('Yeni feedback:', data);
            setFeedbackList(prev => [...prev, data]);
        });

        return () => {
            socket.disconnect();
            console.log('Socket bağlantısı kapatıldı');
        };
    }, []);

    return { feedbackList };
}
