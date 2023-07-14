/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useCallback, useEffect, useState } from 'react'
import Stopwatch from '../Stopwatch/Stopwatch'
import { db } from '../../FirebaseConfig'
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from '../Modal/Modal';
import EditDescription from '../Modal/EditDescription';
import DeleteWarning from '../Modal/DeleteWarning';

import "./Homepage.scss"

export type TrackerType = {
    id: string,
    description: string,
    time: string
    date?: Timestamp
}

enum ModalOptions {
    Edit = "Edit",
    Delete = "Delete"
}

const Homepage = () => {
    const [trackers, setTrackers] = useState<TrackerType[]>([])
    const [trackerDescription, setTrackerDescription] = useState('')
    const [timeLogged, setTimeLogged] = useState("00:00:00")
    const [activeTrackerId, setActiveTrackerId] = useState('')
    const [isAllSTop, setIsAllSTop] = useState(false)
    const [activeStopwatches, setActiveStopwatches] = useState<string[]>([])
    const [isStartingNewTimer, setIsStartingNewTimer] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalData, setModalData] = useState<TrackerType>()
    const [modalType, setModalType] = useState(ModalOptions.Edit)
    /*     const todaysDate = new Date()
        todaysDate.setHours(0, 0, 0, 0);
        const todaysTimestamp = todaysDate.getTime() / 1000; */

    const todaysDate = new Date()

    const startTimestamp = Timestamp.fromDate(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate()));
    const endTimestamp = Timestamp.fromDate(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), 23, 59, 59));


    const trackersCollectionRef = collection(db, 'trackers')

    const queryRef = query(trackersCollectionRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));



    const getTrackers = useCallback(async () => {
        console.log("command to get trackers")
        const querySnapshot = await getDocs(queryRef);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTrackers(data as TrackerType[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(
        () => {
            getTrackers()
        }, [getTrackers]
    )

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

            if (response) {
                getTrackers()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddTracker = () => {
        addTracker()
        setIsStartingNewTimer(false)
    }

    const toggleRow = (rowData: TrackerType) => {
        const isRowActive = isStopwatchActive(rowData.id)
        if (isRowActive) {
            handleRowStop(rowData)
        } else {
            handleRowStart(rowData)
        }
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


    const updateDescription = async (description: string, trackerToEdit: TrackerType) => {
        const docRef = doc(db, 'trackers', trackerToEdit.id);
        try {
            await updateDoc(docRef, {
                description: description
            })
            setIsModalOpen(false)
            getTrackers()

        } catch (error) {
            console.log(error)
        }
    }

    const deleteTracker = async (trackerToDelete: TrackerType) => {
        const docRef = doc(db, 'trackers', trackerToDelete.id);
        try {
            await deleteDoc(docRef)
            setIsModalOpen(false)
            getTrackers()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteRow = (rowData: TrackerType) => {
        setModalType(ModalOptions.Delete)
        setModalData(rowData)
        setIsModalOpen(true)
    }




    const handleEditRow = (rowData: TrackerType) => {
        setModalType(ModalOptions.Edit)
        setModalData(rowData)
        setIsModalOpen(true)
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


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    useEffect(() => {

    }, [activeStopwatches])


    return (
        <div className='homepage'>
            <div>
                <h2>{`Today ${new Date().toLocaleDateString('hr-HR')}`}</h2>
            </div>
            {/* <button onClick={checkOutput} style={{ marginBottom: "3px" }}>check output</button> */}
            <div>
                <div>
                    {isStartingNewTimer ?
                        <div>
                            <input type="text" placeholder='Description' onChange={(e) => setTrackerDescription(e.target.value)} />
                            <button onClick={handleAddTracker}>Add</button>
                            <button onClick={() => setIsStartingNewTimer(false)}>Cancel</button>
                        </div>
                        :
                        <button onClick={() => setIsStartingNewTimer(true)}>Start new timer</button>
                    }
                </div>
            </div>
            <div className='card'>
                {trackers &&
                    <DataTable value={trackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
                        <Column field="time" header="Time" style={{ width: '20%' }} />
                        <Column field="stopwatch" header="Time" body={(rowData) => <><Stopwatch isAllSTop={isAllSTop} data={rowData} isActive={isStopwatchActive(rowData.id)} /></>} />
                        <Column field="description" header="Description" style={{ width: '60%' }} />
                        <Column field="actions" header="Actions" style={{ width: '20%' }} body={(rowData) => <>
                            <div className='btn-control-group'>

                                {isStopwatchActive(rowData.id)
                                    ?
                                    <button className='btn-control' onClick={() => toggleRow(rowData)}><i className='pi pi-pause'></i></button>
                                    :
                                    <button className='btn-control' onClick={() => handleRowStart(rowData)}><i className='pi pi-play'></i></button>}

                                <button className='btn-control' onClick={() => handleEditRow(rowData)}><i className='pi pi-pencil'></i></button>
                                <button className='btn-control' onClick={() => handleDeleteRow(rowData)}><i className='pi pi-trash'></i></button>
                            </div>
                        </>} />
                    </DataTable>
                }
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalType === ModalOptions.Edit && <EditDescription trackerToEdit={modalData} onSave={updateDescription} />}
                {modalType === ModalOptions.Delete && <DeleteWarning trackerToDelete={modalData} onConfirm={deleteTracker} onCancel={() => setIsModalOpen(false)} />}
            </Modal>



        </div>
    )
}

export default Homepage