import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Notification = () => {
  const notify = () => {
    toast("This is a notification!");
  };

  return (
    <div>
      <button onClick={notify}>Show Notification</button>
      <ToastContainer />
    </div>
  );
};

export default Notification;