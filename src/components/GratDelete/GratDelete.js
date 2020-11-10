import React from 'react'
import Button from 'react-bootstrap/Button'

const GratDelete = ({ handleClose, show, children, handleDeleteSubmit }) => {
  const showHideClassName = show ? 'modal delete-display-block' : 'modal delete-display-none'

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <Button onClick={handleClose}>close</Button>
      </section>
    </div>
  )
}

export default GratDelete
