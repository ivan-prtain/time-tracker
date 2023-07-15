import React, { useCallback, useEffect, useRef } from 'react'
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import { TrackerType } from '../Homepage/Homepage';
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../../FirebaseConfig'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

import "./History.scss"

const History = () => {

    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [trackers, setTrackers] = useState<TrackerType[]>([])
    const [filteredTrackers, setFilteredTrackers] = useState<TrackerType[]>([])
    const [descriptionFilter, setDescriptionFilter] = useState('')


    const trackersCollectionRef = collection(db, 'trackers')

    const getTrackers = useCallback(async () => {
        const querySnapshot = await getDocs(trackersCollectionRef)
        console.log("command to get trackers")
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTrackers(data as TrackerType[]);
        setFilteredTrackers(data as TrackerType[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (rowData: any) => {
        const timestamp = rowData.date;
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString("hr-HR");
    };

    function filterTrackersByDescription() {
        return filteredTrackers.filter(tracker => tracker.description.includes(descriptionFilter));
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
            setFilteredTrackers(data as TrackerType[]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate])


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
                setFilteredTrackers(filtered)
            } else {
                getFilteredTrackers()
            }
        }, [descriptionFilter]
    )



    useEffect(() => {
        console.log("third")
        getFilteredTrackers()
    }, [getFilteredTrackers])




    console.log({ filteredTrackers })
    return (
        <div className='history'>History

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
                    <InputText value={descriptionFilter} onChange={(e) => setDescriptionFilter(e.target.value)} />
                </span>

            </div>

            <div className='history__trackers'>
                <div className='card'>
                    {filteredTrackers &&
                        <DataTable value={filteredTrackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
                            <Column field="date" header="Date" style={{ width: '10%' }} body={formatDate} />
                            <Column field="description" header="Description" style={{ width: '60%' }} />
                            <Column field="time" header="Time tracked" style={{ width: '20%' }} />
                        </DataTable>
                    }
                </div>
            </div>


        </div>
    )
}

export default History