import React, {useContext, useEffect, useState, createContext} from 'react'

const NotificationContext = createContext();

//notification types
const NOTIFY_TYPES = {  
    SUCCESS :   'success',
    AFFIRMATION: 'affirmation',
    REJECTIONl: 'rejection',
    DELETION: 'deletion',
};


export const NotificationProvider =({children}) => {
    const [notification, setNotification] = useState({
        message: '',
        type: '',
        visible: false
    })

    //show notificaiton
    const showNotification = (message, type) => {
        
        setNotification({
            message,
            type,
            visible: true,
        });
    }

    //hide notification after 3 seconds
    useEffect(() => {
        if(notification.visible) {
            const timer = setTimeout(() => {
                setNotification({
                    message: '',
                    type: '',
                    visible: false
                });

                },3000);
                
                return() => clearTimeout(timer);

        }
    },[notification.visible])
   

    return (
        <NotificationContext.Provider value={{showNotification, notification}}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext);
