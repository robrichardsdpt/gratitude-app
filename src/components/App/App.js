import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Header from '../Header/Header'
import SignUp from '../SignUp/SignUp'
import SignIn from '../SignIn/SignIn'
import SignOut from '../SignOut/SignOut'
import ChangePassword from '../ChangePassword/ChangePassword'
import GratFeed from '../GratFeed/GratFeed'
import GratList from '../GratList/GratList'
import GratCreate from '../GratCreate/GratCreate'
import Landing from '../Landing/Landing.js'

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      msgAlerts: []
    }
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts, user } = this.state

    return (
      <Fragment>
        <Header user={user} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <main className="container">
          <Route exact path='/' render={() => (
            <Landing msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-up' render={() => (
            <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/grat-feed' render={() => (
            <GratFeed user={user} msgAlert={this.msgAlert}/>
          )} />
          <AuthenticatedRoute user={this.state.user} path='/grat-create' render={() => (
            <GratCreate
              msgAlert={this.msgAlert}
              user={this.state.user} />
          )} />
          <AuthenticatedRoute user={user} path='/gratlist/:id' render={(userParams) => {
            const { match, history } = userParams
            const currentId = match.params.id
            return (
              <GratList
                id={currentId}
                msgAlert={this.msgAlert}
                user={this.state.user}
                history={history} />
            )
          }
          } />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} user={user} />
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
