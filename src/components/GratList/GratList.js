import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import moment from 'moment'

class GratList extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      user: this.props.user,
      gratUser: {},
      gratitudes: [],
      users: []
    }
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
          url: `${apiUrl}/users/${this.props.id}/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
          .then(response => {
            this.setState({
              gratUser: response.data.user
            })
          })
      })
      .catch(console.error)
  }

  render () {
    const userEmail = this.state.gratUser.email
    console.log(this.state.gratUser.email)
    console.log(this.state.gratUser)
    const usersGratitude = []
    this.state.gratitudes.map(gratitude => {
      if (gratitude.owner === parseInt(this.props.id)) {
        usersGratitude.push(gratitude)
      }
    })
    const jsxGratitudeList = usersGratitude.map(gratitude => {
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <Link to={`/gratlist/${gratitude.id}`}><h5 className= 'grat-date'>{moment(gratitude.created_at).format('LLLL')}</h5></Link>
            {gratitude.text}
          </div>
        </div>
      )
    })
    return (
      <div className='container'>
        <h4>{userEmail}</h4>
        {jsxGratitudeList}
        <Link to='/grat-feed'><Button>Return to GratFeed</Button></Link>
      </div>
    )
  }
}

export default GratList
