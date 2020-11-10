import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'
import GratCreate from '../GratCreate/GratCreate'

class GratFeed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
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
              <Link to={`/gratlist/${gratitude.owner}`}><h5 className= 'grat-owner'>{gratOwner}</h5></Link>
            </div>
            <div className='grat-feed-create-date'>
              {gratitude.created_at}
            </div>
          </div>
          <div className='grat-feed-text'>
            {gratitude.text}
          </div>
        </div>
      )
    })
    return (
      <div className='container'>
        <GratCreate user={this.state.user} msgAlert={this.props.msgAlert}/>
        {jsxGratitudeList}
      </div>
    )
  }
}

export default GratFeed
