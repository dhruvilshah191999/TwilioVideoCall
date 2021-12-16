import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Lobby from './chat/Lobby';
import Chat from './chat/Chat';
import React from 'react';
import './chat.css';

const Chat2 = () => {
  const [connection, setConnection] = useState<any>();
  const [messages, setMessages] = useState<any>([]);
  const [users, setUsers] = useState([]);

  const joinRoom = async (user: any, room: any) => {
    try {
      const connection2 = new HubConnectionBuilder()
        .withUrl('https://localhost:44316/chat')
        .configureLogging(LogLevel.Information)
        .build();

      connection2.on('ReceiveMessage', (user: any, message: any, date: any) => {
        setMessages((messages: any) => [...messages, { user, message, date }]);
      });

      // eslint-disable-next-line @typescript-eslint/no-shadow
      connection2.on('UsersInRoom', user => {
        setUsers(user);
      });

      connection2.onclose(e => {
        setConnection(null);
        setMessages([]);
        setUsers([]);
      });

      await connection2.start();
      await connection2.invoke('JoinRoom', { user, room });
      setConnection(connection2);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message: any) => {
    try {
      await connection.invoke('SendMessage', message, new Date());
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app">
      <h2>MyChat</h2>
      <hr className="line" />
      {!connection ? (
        <Lobby joinRoom={joinRoom} />
      ) : (
        <Chat sendMessage={sendMessage} messages={messages} users={users} closeConnection={closeConnection} />
      )}
    </div>
  );
};

export default Chat2;
