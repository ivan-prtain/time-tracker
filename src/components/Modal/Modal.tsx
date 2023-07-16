import React from 'react'
import "./Modal.scss"

type ModalProps = {
    children: React.ReactNode
    isOpen: boolean
    onClose: () => void
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {

    if (!isOpen) {
        return null
    }

    return (
        <div className='modal-background'>
            <div className='modal-container'>
                <div className='modal-top'>
                    <button onClick={onClose}>X</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal