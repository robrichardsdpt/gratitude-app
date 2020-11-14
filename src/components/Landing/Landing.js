import React from 'react'
import axios from 'axios'

class Landing extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: ''
    }
  }
  // api call to get random image from Unsplash API
  componentDidMount () {
    axios.get('https://api.unsplash.com/photos/random/?query=clouds&client_id=Kp3egeqneLsGd6oaMxevKepWdJoLqviZxAxgjEx0p1Y')
      .then(response => {
        this.setState({
          image: response.data.urls.regular
        })
      })
      .catch(console.error)
  } // componentDidMount
  render () {
    console.log(this.state.image)
    return (
      <div className='landing-image'>
        <img src={this.state.image} alt='mountains'/>
      </div>
    )
  }
}

export default Landing
