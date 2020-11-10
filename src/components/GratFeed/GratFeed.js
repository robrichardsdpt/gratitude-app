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
    console.log(this.state.users)
    const jsxGratitudeList = this.state.gratitudes.map(gratitude => {
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <Link to={`/gratlist/${gratitude.owner}`}><h5 className= 'grat-owner'>{gratitude.owner}</h5></Link>
            {gratitude.created_at}
            {gratitude.text}
          </div>
        </div>
      )
    })
    return (
      <div className='container'>
        <GratCreate user={this.state.user}/>
        {jsxGratitudeList}
      </div>
    )
  }
}

export default GratFeed
