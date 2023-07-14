import React, { useCallback, useEffect } from 'react'
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import { TrackerType } from '../Homepage/Homepage';
import { getDocs, collection, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../FirebaseConfig'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const History = () => {

    const [date, setDate] = useState<any>(new Date());
    const [trackers, setTrackers] = useState<TrackerType[]>([])


    const trackersCollectionRef = collection(db, 'trackers')

    const getTrackers = useCallback(async () => {
        const querySnapshot = await getDocs(trackersCollectionRef)
        console.log("command to get trackers")
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTrackers(data as TrackerType[]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (rowData: any) => {
        const timestamp = rowData.date;
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString("hr-HR");
    };

    useEffect(
        () => {
            getTrackers()
        }, [getTrackers]
    )

    return (
        <div className='history'>History

            <div className='history__filters'>
                <div>
                    <Calendar value={date} onChange={(e) => setDate(e.value)} />
                </div>
            </div>

            <div className='history__trackers'>
                <div className='card'>
                    {trackers &&
                        <DataTable value={trackers} paginator rows={10} tableStyle={{ minWidth: '60rem' }}>
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