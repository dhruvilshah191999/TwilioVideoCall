import React from 'react';

const ConnectedUsers = ({ users }: any) => {
  return (
    <div className="user-list">
      <h4>Connected Users</h4>
      {users.map((u: any, idx: any) => (
        <h6 key={idx}>{u}</h6>
      ))}
    </div>
  );
};

export default ConnectedUsers;
