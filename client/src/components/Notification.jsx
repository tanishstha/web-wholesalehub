import React from 'react'
import { useNotification } from '../context/NotificationContext';
import './Notification.scss';



const Notification = () => {
    const {notification} = useNotification();

    if(!notification.visible) {
        return null;
    }


  return (
    <div className={`notification ${notification.type}`}>
        <p>{notification.message}</p>
    </div>
  )
}

export default Notification