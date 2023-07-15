import React, { useCallback, useEffect, useRef } from 'react'
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import { TrackerType, ModalOptions } from '../Homepage/Homepage';
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../../FirebaseConfig'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

import "./History.scss"
import Modal from '../Modal/Modal';
import EditDescription from '../Modal/EditDescription';
import DeleteWarning from '../Modal/DeleteWarning';

const History = () => {

    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [trackers, setTrackers] = useState<TrackerType[]>([])
    // const [filteredTrackers, setFilteredTrackers] = useState<TrackerType[]>([])
    const [descriptionFilter, setDescriptionFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalData, setModalData] = useState<TrackerType>()
    const [modalType, setModalType] = useState(ModalOptions.Edit)


    const trackersCollectionRef = collection(db, 'trackers')

    const getTrackers = useCallback(async () => {
        const querySnapshot = await getDocs(trackersCollectionRef)
        console.log("command to get trackers")
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTrackers(data as TrackerType[]);
        setTrackers(data as TrackerType[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (rowData: any) => {
        const timestamp = rowData.date;
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString("hr-HR");
    };

    function filterTrackersByDescription() {
        return trackers.filter(tracker => tracker.description.includes(descriptionFilter));
    }

    const getFilteredTrackers = useCallback(async () => {
        let startTimestamp = null;
        let endTimestamp = null;
        let queryRef;
        if (startDate) {
            console.log("start date is here")
            startTimestamp = Timestamp.fromDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        }
        if (endDate) {
            console.log("end date is here")
            endTimestamp = Timestamp.fromDate(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
        }

        if (startTimestamp && endTimestamp) {
            queryRef = query(trackersCollectionRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));
        } else if (startTimestamp) {
            queryRef = query(trackersCollectionRef, where('date', '>=', startTimestamp));
        } else if (endTimestamp) {
            queryRef = query(trackersCollectionRef, where('date', '<=', endTimestamp));
        }

        if (queryRef) {
            /* const queryRef = query(trackersCollectionRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp)); */
            const querySnapshot = await getDocs(queryRef)
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            console.log({ data })
            setTrackers(data as TrackerType[]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate])

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


    const handleEditRow = (rowData: TrackerType) => {
        setModalType(ModalOptions.Edit)
        setModalData(rowData)
        setIsModalOpen(true)
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


    useEffect(
        () => {
            console.log("first")
            getTrackers()

        }, [getTrackers]
    )


    // using this way of filtering by description because firebase doesnt support multiple fields filtering with such conditions
    useEffect(
        () => {
            console.log("second")
            if (descriptionFilter) {
                const filtered = filterTrackersByDescription()
                setTrackers(filtered)
            } else {
                getFilteredTrackers()
            }
        }, [descriptionFilter]
    )

    useEffect(() => {
        console.log("third")
        getFilteredTrackers()
    }, [getFilteredTrackers])




    console.log({ trackers })
    return (
        <div className='history'>
            <h2>Trackers history</h2>

            <div className='history__filters'>



                <span className='p-float-label'>
                    <Calendar inputId='start-date' showIcon value={startDate} onChange={(e) => setStartDate(e.value)} />
                    <label htmlFor="start-date">Start date</label>
                </span>
                <span className='p-float-label'>
                    <Calendar inputId='end-date' showIcon value={endDate} onChange={(e) => setEndDate(e.value)} />
                    <label htmlFor="end-date">End date</label>
                </span>

                <span className='p-input-icon-right'>
                    {descriptionFilter && <i onClick={() => setDescriptionFilter("")} className="pi pi-times input-close" />}
                    <InputText placeholder='Description' value={descriptionFilter} onChange={(e) => setDescriptionFilter(e.target.value)} />
                </span>

            </div>

            <div className='history__trackers'>
                <div className='card'>
                    {trackers &&
                        <DataTable value={trackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
                            <Column field="date" header="Date" style={{ width: '10%' }} body={formatDate} />
                            <Column field="description" header="Description" style={{ width: '60%' }} />
                            <Column field="time" header="Time tracked" style={{ width: '20%' }} />
                            <Column field="actions" header="Actions" style={{ width: '20%' }} body={(rowData) => <>
                                <div className='btn-control-group'>
                                    <button className='btn-control' onClick={() => handleEditRow(rowData)}><i className='pi pi-pencil'></i></button>
                                    <button className='btn-control' onClick={() => handleDeleteRow(rowData)}><i className='pi pi-trash'></i></button>
                                </div>
                            </>} />
                        </DataTable>
                    }
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalType === ModalOptions.Edit && <EditDescription trackerToEdit={modalData} onSave={updateDescription} />}
                {modalType === ModalOptions.Delete && <DeleteWarning trackerToDelete={modalData} onConfirm={deleteTracker} onCancel={() => setIsModalOpen(false)} />}
            </Modal>

        </div>
    )
}

export default History