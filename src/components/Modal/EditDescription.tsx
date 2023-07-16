import React, { useState } from 'react'
import { TrackerType } from '../Homepage/Homepage'


type EditDescriptionProps = {
    trackerToEdit?: TrackerType
    onSave: (description: string, trackerToEdit: TrackerType) => void


}

const EditDescription = ({ trackerToEdit, onSave }: EditDescriptionProps) => {

    const [description, setDescription] = useState(trackerToEdit?.description)

    if (!description || !trackerToEdit) {
        return
    } else {
        return (
            <div className='edit-description-container'>
                <div className='edit-description-input-container'>
                    <label htmlFor='modal-edit-description-input'>Description:</label>
                    <input id="modal-edit-description-input" className='edit-description-input' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button className='edit-description-save' onClick={() => onSave(description, trackerToEdit)}>Save</button>
            </div>
        )
    }


}

export default EditDescription