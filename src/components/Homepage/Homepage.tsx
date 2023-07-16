import React, { useCallback, useEffect, useState } from 'react'
import Stopwatch from '../Stopwatch/Stopwatch'
import { db } from '../../FirebaseConfig'
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore';
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

export enum ModalOptions {
    Edit = "Edit",
    Delete = "Delete"
}

const Homepage = () => {
    const [trackers, setTrackers] = useState<TrackerType[]>([])
    const [trackerDescription, setTrackerDescription] = useState('')
    const [activeStopwatches, setActiveStopwatches] = useState<string[]>([])
    const [isStartingNewTimer, setIsStartingNewTimer] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalData, setModalData] = useState<TrackerType>()
    const [modalType, setModalType] = useState(ModalOptions.Edit)

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
                time: "00:00:00",
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
        console.log(rowData)
    }

    const handleRowStop = (rowData: TrackerType) => {
        setActiveStopwatches((prevStopwatches) => {
            return prevStopwatches.filter((id) => id !== rowData.id)
        })
        console.log(rowData)
    }

    const stopAllStopwatches = () => {
        setActiveStopwatches([])
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

    const isStopwatchActive = (id: string) => {
        return activeStopwatches.includes(id)
    }


    useEffect(() => {

    }, [activeStopwatches])


    return (
        <div className='homepage'>
            <div>
                <h2>{`Today (${new Date().toLocaleDateString('hr-HR')})`}</h2>
            </div>
            <div className='homepage__main-buttons-container'>
                <div className='homepage__main-buttons'>
                    {isStartingNewTimer ?
                        <div className='new-timer'>
                            <input type="text" placeholder='Description' onChange={(e) => setTrackerDescription(e.target.value)} />
                            <button onClick={handleAddTracker}>Add</button>
                            <button onClick={() => setIsStartingNewTimer(false)}>Cancel</button>
                        </div>
                        :
                        <button className='btn-icon' onClick={() => setIsStartingNewTimer(true)}><i className='pi pi-stopwatch'></i> <span>Start new timer</span></button>
                    }
                    <button className='secondary-btn-background btn-icon' onClick={stopAllStopwatches}><i className='pi pi-stop-circle'></i><span >Stop all</span></button>
                </div>
            </div>
            <div className='homepage__trackers'>
                {trackers &&
                    <DataTable value={trackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
                        <Column field="stopwatch" header="Time" style={{ width: '20%' }} body={(rowData) => <><Stopwatch data={rowData} isActive={isStopwatchActive(rowData.id)} /></>} />
                        <Column field="description" header="Description" style={{ width: '60%' }} />
                        <Column field="actions" header="Actions" style={{ width: '20%' }} body={(rowData) => <>
                            <div className='btn-control-group'>

                                {isStopwatchActive(rowData.id)
                                    ?
                                    <button className='btn-control btn-control-primary' onClick={() => toggleRow(rowData)}><i className='pi pi-pause'></i></button>
                                    :
                                    <button className='btn-control btn-control-primary' onClick={() => handleRowStart(rowData)}><i className='pi pi-play'></i></button>}

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