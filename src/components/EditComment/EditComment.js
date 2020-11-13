import React from 'react'
import Button from 'react-bootstrap/Button'
const EditComment = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal edit-comment-display-block' : 'modal edit-comment-display-none'
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <Button onClick={handleClose}>close</Button>
      </section>
    </div>
  )
}

export default EditComment
