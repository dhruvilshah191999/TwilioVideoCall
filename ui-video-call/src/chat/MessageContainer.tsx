import React, { useEffect, useRef } from 'react';

const MessageContainer = ({ messages }: any) => {
  const messageRef: any = useRef();

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div ref={messageRef} className="message-container">
      {messages.map((m: any, index: any) => (
        <div key={index} className="user-message">
          <div>{m.message}</div>
          <div className="from-user">{m.user}</div>
          <div className="from-user">{m.date}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
