import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'
import GratCreate from '../GratCreate/GratCreate'
import messages from '../AutoDismissAlert/messages'
import moment from 'moment'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiCommentAdd } from 'react-icons/bi'
import { AiOutlineHeart } from 'react-icons/ai'

class GratFeed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      gratitudes: [],
      users: [],
      gratitude: {
        text: '',
        created_at: '',
        owner: ''
      }
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
        Authorization: 'Token ' + `${this.state.user.token}`
      },
      data: {
        gratitude: gratitude
      }
    })
      .then((response) => {
        this.setState({
          createdGratitudeId: response.data.gratitude.id
        })
        return axios({
          url: `${apiUrl}/gratitudes/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
          .then(response => {
            this.setState({
              gratitudes: response.data.gratitudes
            })
          })
      })
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
  componentDidMount () {
    axios({
      url: `${apiUrl}/gratitudes/`,
      method: 'GET',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(response => {
        this.setState({
          gratitudes: response.data.gratitudes
        })
        return axios({
          url: `${apiUrl}/users/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
          .then(response => {
            this.setState({
              users: response.data.users
            })
          })
      })
      .catch(console.error)
  }

  render () {
    const jsxGratitudeList = this.state.gratitudes.map(gratitude => {
      let gratOwner = ''
      for (let i = 0; i < this.state.users.length; i++) {
        if (gratitude.owner === this.state.users[i].id) {
          gratOwner = this.state.users[i].email
        }
      }
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <div className='owner'>
              <Link to={`/gratlist/${gratitude.owner}`}><h5 className= 'grat-owner'>{gratOwner}</h5></Link> <span className='editbtn'><BsThreeDotsVertical/></span>
            </div>
            <div className='grat-feed-create-date'>
              {moment(gratitude.created_at).format('LLLL')}
            </div>
          </div>
          <div className='grat-feed-text'>
            {gratitude.text}<br/>
          </div>
          <div className="row">
            <div className="col-10 heart"><AiOutlineHeart/></div>
            <div className='col-2 comment-bubble'><BiCommentAdd/></div>
          </div>
        </div>
      )
    })
    return (
      <div className='container'>
        <GratCreate user={this.state.user} msgAlert={this.props.msgAlert} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>
        {jsxGratitudeList}
      </div>
    )
  }
}

export default GratFeed
