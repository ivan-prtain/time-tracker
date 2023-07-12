import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 59) {
                        setMinutes((prevMinutes) => {
                            if (prevMinutes === 59) {
                                setHours((prevHours) => prevHours + 1);
                                return 0;
                            }
                            return prevMinutes + 1;
                        });
                        return 0;
                    }
                    return prevSeconds + 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const startStopwatch = () => {
        setIsRunning(true);
    };

    const stopStopwatch = () => {
        setIsRunning(false);
    };

    const resetStopwatch = () => {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setIsRunning(false);
    };

    return (
        <div>
            <div>
                <span>{hours.toString().padStart(2, '0')}:</span>
                <span>{minutes.toString().padStart(2, '0')}:</span>
                <span>{seconds.toString().padStart(2, '0')}</span>
            </div>
            <button onClick={startStopwatch}>Start</button>
            <button onClick={stopStopwatch}>Stop</button>
            <button onClick={resetStopwatch}>Reset</button>
        </div>
    );
};

export default Stopwatch;