import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import Form from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import messages from '../AutoDismissAlert/messages'

class GratCreate extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props)
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

  // handles all user input
  handleChange = (event) => {
    // get the value that the user typed in
    const userInput = event.target.value
    // get the name of the input that the user typed in
    const gratKey = event.target.name
    // make a copy of the state
    const gratCopy = Object.assign({}, this.state.gratitude) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
    // Object.assign({}, object-to-copy) allows you to combine two objects
    // updating the key in our state with what the user typed in
    gratCopy[gratKey] = userInput
    // updating the state with our new copy
    this.setState({ gratitude: gratCopy
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { msgAlert } = this.props
    const gratitude = this.state.gratitude
    axios({
      url: `${apiUrl}/gratitudes/`,
      method: 'POST',
      headers: {
        Authorization: 'Token ' + `${this.state.token}`
      },
      data: {
        gratitude: gratitude
      }
    })
      .then((response) => this.setState({
        createdGratitudeId: response.data.gratitude.id
      })
      )
      .then(() => msgAlert({
        heading: 'New Gratitude Added With Success',
        message: messages.uploadGratSuccess,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Could not upload your gratitude, failed with error: ' + error.messages,
          message: messages.uploadGratFailure,
          variant: 'danger'
        })
      })
  }
  render () {
    return (
      <div className='top-of-create'>
        <div className='col'>
          <Form onSubmit={this.handleSubmit} >
            <Form.Label className='textLabel'><h5>What are you grateful for today?</h5></Form.Label>
            <Form.Control name="text" id="text" onChange={this.handleChange} type="text" placeholder="Today I am grateful for..." />
            <Button variant='primary' type="submit" className='create-submit'> Submit </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default GratCreate
