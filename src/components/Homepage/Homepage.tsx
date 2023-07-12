import React, { useEffect, useState } from 'react'
import Stopwatch from '../Stopwatch/Stopwatch'
import { db } from '../../FirebaseConfig'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore';

const Homepage = () => {
    const [trackers, setTrackers] = useState<any>()

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
            setTrackers(data);
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





    return (
        <div>
            <Stopwatch />
        </div>
    )
}

export default Homepage