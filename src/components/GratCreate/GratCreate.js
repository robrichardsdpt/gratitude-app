import React from 'react'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
// import messages from '../AutoDismissAlert/messages'
import { withRouter } from 'react-router-dom'

class GratCreate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      gratitude: {
        text: '',
        owner: this.props.user.id,
        created_at: ''
      },
      createdGratitudeId: '',
      token: this.props.user.token
    }
  }

  render () {
    return (
      <div className='top-of-create'>
        <div className='col'>
          <Form className='gratCreateform' onSubmit={this.props.handleSubmit} >
            <Form.Group controlId="textarea">
              <Form.Label className='textLabel'><h5>What are you grateful for today?</h5></Form.Label>
              <Form.Control name="text" onChange={this.props.handleChange} as="textarea" rows={3} placeholder="Today I am grateful for..." />
              <Button variant='primary' type="submit" className='create-submit'> Submit </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(GratCreate)
