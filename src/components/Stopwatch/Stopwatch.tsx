import { Timestamp } from '@firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../FirebaseConfig'
import React, { useState, useEffect } from 'react';

type TrackerType = {
    id: string,
    description: string,
    time: string
    date: Timestamp
}

type StopwatchProps = {
    isActive: boolean
    data: TrackerType
}

const Stopwatch = ({ data, isActive }: StopwatchProps) => {
    const [hours, setHours] = useState(parseInt(data.time.split(':')[0]));
    const [minutes, setMinutes] = useState(parseInt(data.time.split(':')[1]));
    const [seconds, setSeconds] = useState(parseInt(data.time.split(':')[2]));
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

    useEffect(() => {
        if (isActive) {
            setIsRunning(true);
        } else {
            setIsRunning(false);
            updateDbTime();
        }
    }, [isActive]);

    useEffect(() => {
        const interval = setInterval(() => {
            updateDbTime();
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, []);

    const updateDbTime = async () => {
        const docRef = doc(db, 'trackers', data.id);
        await updateDoc(docRef, {
            time: `${hours}:${minutes}:${seconds}`
        })
    }

    return (
        <div>
            <div>
                <span>{hours.toString().padStart(2, '0')}:</span>
                <span>{minutes.toString().padStart(2, '0')}:</span>
                <span>{seconds.toString().padStart(2, '0')}</span>
            </div>
        </div>
    );
};

export default Stopwatch;