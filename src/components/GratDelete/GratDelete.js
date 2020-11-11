import React from 'react'
import Button from 'react-bootstrap/Button'

const GratDelete = ({ handleClose, show, children, handleDeleteSubmit, gratitude }) => {
  const showHideClassName = show ? 'modal delete-display-block' : 'modal delete-display-none'
  console.log(gratitude)
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        Are you sure you want to delete this gratitude?
        <Button name={gratitude.id} onClick={handleDeleteSubmit}>Yes, Delete.</Button>
        <Button onClick={handleClose}>close</Button>
      </section>
    </div>
  )
}

export default GratDelete
