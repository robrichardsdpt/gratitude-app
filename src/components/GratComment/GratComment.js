import React from 'react'
import Button from 'react-bootstrap/Button'

const GratComment = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal comment-display-block' : 'modal comment-display-none'
  return (
    <div className={showHideClassName}>
      <section className="comment-modal-main">
        {children}
        <Button onClick={handleClose}>close</Button>
      </section>
    </div>
  )
}

export default GratComment
