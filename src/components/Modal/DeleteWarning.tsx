import React from 'react'
import "./DeleteWarning.scss"
import { TrackerType } from '../Homepage/Homepage'

type DeleteWarningProps = {
    onConfirm: (tracker: TrackerType) => void
    onCancel: () => void
    trackerToDelete?: TrackerType
}

const DeleteWarning = ({ onConfirm, onCancel, trackerToDelete }: DeleteWarningProps) => {
    if (!trackerToDelete) return

    return (
        <div className='delete-warning'>
            <div>Are you sure you want to delete this tracker?</div>
            <div className='delete-warning-buttons'>
                <button onClick={() => onConfirm(trackerToDelete)}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    )
}

export default DeleteWarning