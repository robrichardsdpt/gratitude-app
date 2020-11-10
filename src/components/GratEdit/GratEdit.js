import React from 'react'
import Button from 'react-bootstrap/Button'

const GratEdit = ({ handleClose, show, children, handleEditSubmit, handleEditChanges }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none'

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <Button onClick={handleClose}>close</Button>
      </section>
    </div>
  )
}

export default GratEdit
