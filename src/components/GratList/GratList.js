import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'

class GratList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.state.props.user,
      gratitudes: []
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
      })
      .catch(console.error)
  }

  render () {
    const usersGratitude = []
    this.state.clients.map(gratitude => {
      if (gratitude.owner === this.params.id) {
        usersGratitude.push(gratitude)
      }
    })
    const jsxGratitudeList = usersGratitude.map(gratitude => {
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <Link to={`/gratlist/${gratitude.id}`}><h5 className= 'grat-date'>{gratitude.created_at}</h5></Link>
            {gratitude.text}
          </div>
        </div>
      )
    })
    return (
      <div className='container'>
        {jsxGratitudeList}
      </div>
    )
  }
}

export default GratList
