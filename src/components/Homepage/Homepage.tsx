import React, { useEffect, useState } from 'react'
import Stopwatch from '../Stopwatch/Stopwatch'
import { db } from '../../FirebaseConfig'
import { getDocs, collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import "./Homepage.scss"

type TrackerType = {
    id: string,
    description: string,
    time: string
    date: Timestamp
}

const Homepage = () => {
    const [trackers, setTrackers] = useState<TrackerType[]>([])
    const [trackerDescription, setTrackerDescription] = useState('')
    const [timeLogged, setTimeLogged] = useState("00:00:00")
    const [activeTrackerId, setActiveTrackerId] = useState('')
    const [isAllSTop, setIsAllSTop] = useState(false)
    const [activeStopwatches, setActiveStopwatches] = useState<string[]>([])
    /*     const todaysDate = new Date()
        todaysDate.setHours(0, 0, 0, 0);
        const todaysTimestamp = todaysDate.getTime() / 1000; */

    const todaysDate = new Date()

    const startTimestamp = Timestamp.fromDate(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate()));
    const endTimestamp = Timestamp.fromDate(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), 23, 59, 59));


    const trackersCollectionRef = collection(db, 'trackers')

    // const queryRef = query(trackersCollectionRef, where('date.seconds', '==', todaysTimestamp));
    const queryRef = query(trackersCollectionRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));
    useEffect(() => {
        const getTrackers = async () => {
            const querySnapshot = await getDocs(queryRef)
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTrackers(data as TrackerType[]);
        }

        getTrackers()
    }, [])

    useEffect(
        () => {
            if (trackers) {
                console.log(trackers)
            }
        }, [trackers]
    )

    const addTracker = async () => {
        const currentDate = serverTimestamp()

        try {
            const response = await addDoc(trackersCollectionRef, {
                date: currentDate,
                description: trackerDescription,
                time: timeLogged,

            })

            console.log({ response })
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddTracker = () => {
        addTracker()
    }

    const handleRowStart = (rowData: TrackerType) => {
        setActiveStopwatches((prevStopwatches) => [...prevStopwatches, rowData.id])
        setActiveTrackerId(rowData.id)
        console.log(rowData)
    }

    const handleRowStop = (rowData: TrackerType) => {
        setActiveStopwatches((prevStopwatches) => {
            return prevStopwatches.filter((id) => id !== rowData.id)
        })
        console.log(rowData)
    }

    const saveLoggedTimeState = (loggedTime: string) => {
        setTimeLogged(loggedTime)

        setTrackers((prevTrackers) => {
            console.log("here")
            return prevTrackers.map((tracker) => {
                if (tracker.id === activeTrackerId) {
                    console.log("there is a match")
                    return { ...tracker, time: loggedTime };
                }
                return tracker;
            });
        });

        console.log(trackers)
    }


    const checkOutput = () => {
        console.log(trackers)
    }

    const isStopwatchActive = (id: string) => {
        return activeStopwatches.includes(id)
    }


    useEffect(() => {

    }, [activeStopwatches])


    return (
        <div className='homepage'>
            <div>

            </div>
            <Button onClick={checkOutput}>check output</Button>
            <div>
                <div>
                    <Button>Start new timer</Button>
                    <div>
                        <input type="text" placeholder='Description' onChange={(e) => setTrackerDescription(e.target.value)} />
                        <Button onClick={handleAddTracker}>Add</Button>
                    </div>
                </div>
            </div>
            <div className='card'>
                {trackers &&
                    <DataTable value={trackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
                        <Column field="time" header="Time" style={{ width: '20%' }} />
                        <Column field="stopwatch" header="Time" body={(rowData) => <><Stopwatch isAllSTop={isAllSTop} data={rowData} isActive={isStopwatchActive(rowData.id)} /></>} />
                        <Column field="description" header="Description" style={{ width: '60%' }} />
                        <Column field="actions" header="Actions" body={(rowData) => <>
                            <Button onClick={() => handleRowStart(rowData)}>Start</Button>
                            <Button onClick={() => handleRowStop(rowData)}>Stop</Button>
                        </>} />
                    </DataTable>
                }
            </div>



        </div>
    )
}

export default Homepage