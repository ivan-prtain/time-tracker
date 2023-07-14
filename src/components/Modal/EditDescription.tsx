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
            <div>
                <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                <button onClick={() => onSave(description, trackerToEdit)}>Save</button>
            </div>
        )
    }


}

export default EditDescription