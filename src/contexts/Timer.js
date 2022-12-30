import React, {createContext, useEffect, useState } from 'react';

export const TimerContext = createContext({});

export const Timer = (props) => {

    const [timerCountdown, setTimerCountdown] = useState({
        minutes:15, 
        seconds:59
    });

    useEffect(() => {
      console.log("updated")
    }, [timerCountdown])
    

    const Update = (name, time) => {
        setTimerCountdown(prev=>{
            return {
                ...prev,
                [name]:time
            }
        })
    }
    
    return (
        <TimerContext.Provider 
            value={{ minutes:timerCountdown.minutes, 
            seconds:timerCountdown.seconds, 
            updateTimer:Update }}
        >
            {props?.children}
        </TimerContext.Provider>
    )
}

