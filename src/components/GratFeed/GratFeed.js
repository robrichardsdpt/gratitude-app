import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'

class GratFeed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
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
    const jsxGratitudeList = this.state.gratitudes.map(gratitude => {
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <Link to={`/gratlist/${gratitude.owner}`}><h5 className= 'grat-owner'>{gratitude.owner}</h5></Link>
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

export default GratFeed
