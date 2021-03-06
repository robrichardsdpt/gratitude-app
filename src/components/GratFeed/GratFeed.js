import React from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import { Link } from 'react-router-dom'
import GratCreate from '../GratCreate/GratCreate'
import messages from '../AutoDismissAlert/messages'
import moment from 'moment'
// import { BiCommentAdd } from 'react-icons/bi'
// import { AiOutlineHeart } from 'react-icons/ai'
import InputGroup from 'react-bootstrap/InputGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import GratEdit from '../GratEdit/GratEdit'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import GratComment from '../GratComment/GratComment'
import CommentEdit from '../EditComment/EditComment'

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
        owner: '',
        gratitude_likes: 0
      },
      gratitude_likes: [],
      comment_likes: [],
      showEdit: false,
      showDelete: false,
      showComment: false,
      editGratitudeId: '',
      gratitudeIdForComment: null,
      createdGratitudelikeId: '',
      gratitude_like: {
        like: 0,
        owner: this.props.user.id,
        gratitude: 0
      },
      comment_like: {
        like: 0,
        owner: this.props.user.id,
        comment: 0
      },
      comment: {
        text: '',
        owner: this.props.user.id,
        created_at: '',
        gratitude: 0
      },
      comments: [],
      showCommentEdit: false,
      showCommentDelete: false,
      editCommentId: '',
      createdCommentlikeId: ''
    }
  }

  handleCommentDelete = (event) => {
    const { msgAlert } = this.props
    const commentId = event.target.name
    axios({
      url: `${apiUrl}/comments/${commentId}/`,
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(() => msgAlert({
        heading: 'Successfully Deleted Comment',
        message: messages.deleteCommentSuccess,
        variant: 'success'
      }))
      .then(() => {
        return axios({
          url: `${apiUrl}/comments/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
      }
      )
      .then(response => {
        this.setState({
          comments: response.data.comments
        })
        return axios({
          url: `${apiUrl}/gratitudes/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
      }
      )
      .then(response => {
        this.setState({
          gratitudes: response.data.gratitudes
        })
      })
      .catch(error => {
        msgAlert({
          heading: 'Could not delete the Comment, failed with error: ' + error.messages,
          message: messages.deleteCommentFailure,
          variant: 'danger'
        })
      })
      .catch(console.error)
  }

  commentBasedOnId = (id, comments) => {
    for (let i = 0; i < comments.length; i++) {
      const intId = parseInt(id)
      const commentId = parseInt(comments[i].id)
      if (commentId === intId) {
        this.setState({
          comment_like: {
            comment: commentId
          }
        })
        return comments[i]
      }
    }
  }

  findCommentLike = (comment, owner) => {
    let commentLike
    for (let i = 0; i < this.state.comment_likes.length; i++) {
      if (this.state.comment_likes[i].owner === parseInt(owner) && this.state.comment_likes[i].comment === parseInt(comment)) {
        commentLike = this.state.comment_likes[i]
        return commentLike
      }
    }
    return false
  }

  onCommentLike = (event) => {
    const commentClick = event.target.name
    let comment = {}
    comment = this.commentBasedOnId(commentClick, this.state.comments)
    const commentLikesArray = comment.likes
    const user = this.state.user.id
    let commentLike = {}
    commentLike = this.findCommentLike(commentClick, this.state.user.id)
    // gratLike tells you that the owner has a like for that gratitude already and sends it to be deleted
    if (commentLikesArray.length !== 0 && commentLike) {
      this.setState({
        comment_like:
        { like: 0,
          owner: user,
          comment: comment }
      })
      return axios({
        url: `${apiUrl}/comment_likes/${commentLike.id}`,
        method: 'DELETE',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        }
      })
        .then((response) => {
          return axios({
            url: `${apiUrl}/comments/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
        })
        .then(response => {
          this.setState({
            comments: response.data.comments
          })
          return axios({
            url: `${apiUrl}/comment_likes/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
        })
        .then(response => {
          this.setState({
            comment_likes: response.data.comment_likes
          })
        })
    } else if (commentLikesArray.length !== 0 && !commentLike) {
      const cLCopy = Object.assign({}, this.state.comment_like) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
      // Object.assign({}, object-to-copy) allows you to combine two objects
      // updating the key in our state with what the user typed in
      cLCopy['owner'] = this.state.user.id
      cLCopy['comment'] = commentClick
      this.setState({
        comment_like: cLCopy
      })
      return axios({
        url: `${apiUrl}/comment_likes/`,
        method: 'POST',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        },
        data: {
          comment_like: cLCopy
        }
      })
        .then((response) => {
          this.setState({
            createdCommentlikeId: response.data.comment_like.id
          })
          return axios({
            url: `${apiUrl}/comments/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
            .then(response => {
              this.setState({
                comments: response.data.comments
              })
              return axios({
                url: `${apiUrl}/comment_likes/`,
                method: 'GET',
                headers: {
                  Authorization: 'Token ' + `${this.state.user.token}`
                }
              })
                .then(response => {
                  this.setState({
                    comment_likes: response.data.comment_likes
                  })
                })
            })
        })
    } else if (commentLikesArray.length === 0 && !commentLike) {
      const cLCopy = Object.assign({}, this.state.comment_like) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
      // Object.assign({}, object-to-copy) allows you to combine two objects
      // updating the key in our state with what the user typed in
      cLCopy['owner'] = this.state.user.id
      cLCopy['comment'] = commentClick
      this.setState({
        comment_like: cLCopy
      })
      return axios({
        url: `${apiUrl}/comment_likes/`,
        method: 'POST',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        },
        data: {
          comment_like: cLCopy
        }
      })
        .then((response) => {
          this.setState({
            createdCommentlikeId: response.data.comment_like.id
          })
          return axios({
            url: `${apiUrl}/comments/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
            .then(response => {
              this.setState({
                comments: response.data.comments
              })
              return axios({
                url: `${apiUrl}/comment_likes/`,
                method: 'GET',
                headers: {
                  Authorization: 'Token ' + `${this.state.user.token}`
                }
              })
                .then(response => {
                  this.setState({
                    comment_likes: response.data.comment_likes
                  })
                })
            })
        })
    }
  }

  // a comment requires text, owner, and created_at
  showCommentModal = (event) => {
    this.setState({
      showComment: true,
      gratitudeIdForComment: event.target.name
    })
    axios({
      url: `${apiUrl}/gratitudes/${event.target.name}`,
      method: 'GET',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(response => {
        this.setState({
          gratitude: response.data.gratitude
        })
      })
  }

  hideCommentModal = () => {
    this.setState({
      showComment: false
    })
  }

  handleCommentChange = (event) => {
    // get the value that the user typed in
    const userInput = event.target.value
    // get the name of the input that the user typed in
    const commentKey = event.target.name
    // make a copy of the state
    const commentCopy = Object.assign({}, this.state.comment) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
    // Object.assign({}, object-to-copy) allows you to combine two objects
    // updating the key in our state with what the user typed in
    commentCopy[commentKey] = userInput
    commentCopy['gratitude'] = this.state.gratitudeIdForComment
    // updating the state with our new copy
    this.setState({ comment: commentCopy
    })
  }

  handleCommentSubmit = (event) => {
    event.preventDefault()
    const { msgAlert } = this.props
    const comment = this.state.comment
    axios({
      url: `${apiUrl}/comments/`,
      method: 'POST',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      },
      data: {
        comment: comment
      }
    })
      .then((response) => {
        this.setState({
          createdCommentId: response.data.comment.id
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
            return axios({
              url: `${apiUrl}/comments/`,
              method: 'GET',
              headers: {
                Authorization: 'Token ' + `${this.state.user.token}`
              }
            })
              .then(response => {
                this.setState({
                  comments: response.data.comments,
                  showComment: false
                })
              })
          })
      })
      .then(() => msgAlert({
        heading: 'New Comment Added With Success',
        message: messages.uploadGratSuccess,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Could not upload your comment, failed with error: ' + error.messages,
          message: messages.uploadGratFailure,
          variant: 'danger'
        })
      })
  }

  showEditCommentModal = (event) => {
    this.setState({
      showCommentEdit: true,
      editCommentId: event.target.name
    })
    axios({
      url: `${apiUrl}/comments/${event.target.name}/`,
      method: 'GET',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(response => {
        this.setState({
          comment: response.data.comment
        })
      })
  }

  hideEditCommentModal = () => {
    this.setState({
      showCommentEdit: false
    })
  }

  handleCommentEditChange = (event) => {
    // get the value that the user typed in
    const userInput = event.target.value
    // get the name of the input that the user typed in
    const commentKey = event.target.name
    // make a copy of the state
    const commentCopy = Object.assign({}, this.state.comment) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
    // Object.assign({}, object-to-copy) allows you to combine two objects
    // updating the key in our state with what the user typed in
    commentCopy[commentKey] = userInput
    // updating the state with our new copy
    this.setState({ comment: commentCopy
    })
  }

  handleCommentEditSubmit = (event) => {
    event.preventDefault()
    const { msgAlert } = this.props
    const comment = this.state.comment
    axios({
      url: `${apiUrl}/comments/${this.state.editCommentId}/`,
      method: 'PATCH',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      },
      data: {
        comment: comment
      }
    })
      .then((response) => {
        return axios({
          url: `${apiUrl}/gratitudes/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
          .then(response => {
            this.setState({
              showCommentEdit: false,
              gratitudes: response.data.gratitudes
            })
            return axios({
              url: `${apiUrl}/comments/`,
              method: 'GET',
              headers: {
                Authorization: 'Token ' + `${this.state.user.token}`
              }
            })
              .then(response => {
                this.setState({
                  comments: response.data.comments,
                  showComment: false
                })
              })
          })
      })
      .then(() => msgAlert({
        heading: 'New Comment Added With Success',
        message: messages.uploadGratSuccess,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Could not upload your comment, failed with error: ' + error.messages,
          message: messages.uploadGratFailure,
          variant: 'danger'
        })
      })
  }

  gratitudeBasedOnId = (id, gratitudes) => {
    for (let i = 0; i < gratitudes.length; i++) {
      const intId = parseInt(id)
      const gratId = parseInt(gratitudes[i].id)
      if (gratId === intId) {
        this.setState({
          gratitude_like: {
            gratitude: gratId
          }
        })
        return gratitudes[i]
      }
    }
  }

  findGratitudeLike = (gratitude, owner) => {
    let gratitudeLike
    for (let i = 0; i < this.state.gratitude_likes.length; i++) {
      if (this.state.gratitude_likes[i].owner === parseInt(owner) && this.state.gratitude_likes[i].gratitude === parseInt(gratitude)) {
        gratitudeLike = this.state.gratitude_likes[i]
        return gratitudeLike
      }
    }
    return false
  }

  onLike = (event) => {
    const gratClick = event.target.id
    let grat = {}
    grat = this.gratitudeBasedOnId(gratClick, this.state.gratitudes)
    const gratitudeLikesArray = grat.likes
    const user = this.state.user.id
    let gratLike = {}
    gratLike = this.findGratitudeLike(gratClick, this.state.user.id)
    // gratLike tells you that the owner has a like for that gratitude already and sends it to be deleted
    if (gratitudeLikesArray.length !== 0 && gratLike) {
      this.setState({
        gratitude_like:
        { like: 0,
          owner: user,
          gratitude: grat }
      })
      return axios({
        url: `${apiUrl}/gratitude_likes/${gratLike.id}`,
        method: 'DELETE',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        }
      })
        .then((response) => {
          return axios({
            url: `${apiUrl}/gratitudes/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
        })
        .then(response => {
          this.setState({
            gratitudes: response.data.gratitudes
          })
          return axios({
            url: `${apiUrl}/gratitude_likes/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
        })
        .then(response => {
          this.setState({
            gratitude_likes: response.data.gratitude_likes
          })
        })
    } else if (gratitudeLikesArray.length !== 0 && !gratLike) {
      const gLCopy = Object.assign({}, this.state.gratitude_like) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
      // Object.assign({}, object-to-copy) allows you to combine two objects
      // updating the key in our state with what the user typed in
      gLCopy['owner'] = this.state.user.id
      gLCopy['gratitude'] = gratClick
      this.setState({
        gratitude_like: gLCopy
      })
      return axios({
        url: `${apiUrl}/gratitude_likes/`,
        method: 'POST',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        },
        data: {
          gratitude_like: gLCopy
        }
      })
        .then((response) => {
          this.setState({
            createdGratitudelikeId: response.data.gratitude_like.id
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
              return axios({
                url: `${apiUrl}/gratitude_likes/`,
                method: 'GET',
                headers: {
                  Authorization: 'Token ' + `${this.state.user.token}`
                }
              })
                .then(response => {
                  this.setState({
                    gratitude_likes: response.data.gratitude_likes
                  })
                })
            })
        })
    } else if (gratitudeLikesArray.length === 0 && !gratLike) {
      const gLCopy = Object.assign({}, this.state.gratitude_like) // to get the original state of the run and to copy it into another object to bypass inability to assign to a state
      // Object.assign({}, object-to-copy) allows you to combine two objects
      // updating the key in our state with what the user typed in
      gLCopy['owner'] = this.state.user.id
      gLCopy['gratitude'] = gratClick
      this.setState({
        gratitude_like: gLCopy
      })
      return axios({
        url: `${apiUrl}/gratitude_likes/`,
        method: 'POST',
        headers: {
          Authorization: 'Token ' + `${this.state.user.token}`
        },
        data: {
          gratitude_like: gLCopy
        }
      })
        .then((response) => {
          this.setState({
            createdGratitudelikeId: response.data.gratitude_like.id
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
              return axios({
                url: `${apiUrl}/gratitude_likes/`,
                method: 'GET',
                headers: {
                  Authorization: 'Token ' + `${this.state.user.token}`
                }
              })
                .then(response => {
                  this.setState({
                    gratitude_likes: response.data.gratitude_likes
                  })
                })
            })
        })
    }
  }

  showEditModal = (event) => {
    this.setState({
      showEdit: true,
      editGratitudeId: event.target.name
    })
    axios({
      url: `${apiUrl}/gratitudes/${event.target.name}`,
      method: 'GET',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(response => {
        this.setState({
          gratitude: response.data.gratitude
        })
      })
  }

  handleEditSubmit = (event) => {
    event.preventDefault()
    const { msgAlert } = this.props
    const gratitude = this.state.gratitude
    axios({
      url: `${apiUrl}/gratitudes/${this.state.editGratitudeId}/`,
      method: 'PATCH',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      },
      data: {
        gratitude: gratitude
      }
    })
      .then((response) => {
        this.setState({
          showEdit: false
        })
        return (
          axios({
            url: `${apiUrl}/gratitudes/`,
            method: 'GET',
            headers: {
              Authorization: 'Token ' + `${this.state.user.token}`
            }
          })
        )
      }
      )
      .then(response => {
        this.setState({
          gratitudes: response.data.gratitudes
        })
      })
      .then(() => msgAlert({
        heading: 'Gratitude Updated With Success',
        message: messages.uploadGratitudeSuccess,
        variant: 'success'
      }))
      .catch(error => {
        msgAlert({
          heading: 'Could not upload your gratitude changes, failed with error: ' + error.messages,
          message: messages.uploadGratitudeFailure,
          variant: 'danger'
        })
      })
  }

  hideEditModal = () => {
    this.setState({
      showEdit: false
    })
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

  handleDeleteSubmit = (event) => {
    const { msgAlert } = this.props
    const gratitudeId = event.target.name
    axios({
      url: `${apiUrl}/gratitudes/${gratitudeId}/`,
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + `${this.state.user.token}`
      }
    })
      .then(() => msgAlert({
        heading: 'Successfully Deleted Gratitude',
        message: messages.deleteGratitudeSuccess,
        variant: 'success'
      }))
      .then(() => {
        return axios({
          url: `${apiUrl}/gratitudes/`,
          method: 'GET',
          headers: {
            Authorization: 'Token ' + `${this.state.user.token}`
          }
        })
      }
      )
      .then(response => {
        this.setState({
          gratitudes: response.data.gratitudes
        })
      })
      .catch(error => {
        msgAlert({
          heading: 'Could not delete the Gratitude, failed with error: ' + error.messages,
          message: messages.deleteGratitudeFailure,
          variant: 'danger'
        })
      })
      .catch(console.error)
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
            return axios({
              url: `${apiUrl}/gratitude_likes/`,
              method: 'GET',
              headers: {
                Authorization: 'Token ' + `${this.state.user.token}`
              }
            })
              .then(response => {
                this.setState({
                  gratitude_likes: response.data.gratitude_likes
                })
                return axios({
                  url: `${apiUrl}/comments/`,
                  method: 'GET',
                  headers: {
                    Authorization: 'Token ' + `${this.state.user.token}`
                  }
                })
                  .then(response => {
                    this.setState({
                      comments: response.data.comments
                    })
                  })
              })
          })
      })
      .catch(console.error)
  }

  render () {
    const commentToJsx = (array) => {
      const newArray = []
      array.map(comment => {
        let commentOwner = ''
        for (let i = 0; i < this.state.users.length; i++) {
          if (comment.owner === this.state.users[i].id) {
            commentOwner = this.state.users[i].email
          }
        }
        newArray.push(
          <div key={comment.id} size="4" className="commentfeed">
            <div className='comment-container'>
              <div className='comment-owner'>
                <h5><Link to={`/gratlist/${comment.owner}`}>{commentOwner}</Link></h5>
                <span className= 'comment-date'>{moment(comment.created_at).format('LLLL')}</span><br/>
                {comment.text}
                <div className='commentDropDown'>
                  <span className='editbtn'><DropdownButton
                    as={InputGroup.Prepend}
                    variant="primary"
                    id="input-group-dropdown-1"
                    title='...'
                    size='sm'
                  >
                    <Dropdown.Item name={comment.id} eventKey={comment.id} onClick={this.showEditCommentModal}>Edit</Dropdown.Item>
                    <Dropdown.Item name={comment.id} eventKey={comment.id} onClick={this.handleCommentDelete}>Delete</Dropdown.Item>
                    <Dropdown.Item name='cancel'>Cancel</Dropdown.Item>
                  </DropdownButton></span>
                </div>
              </div>
              <br/>
            </div>
            <div className="col-9 heart" ><Button variant="primary" size='sm' className='heartbtn' name={comment.id} onClick={this.onCommentLike}>Like</Button>{comment.likes.length}</div>
          </div>
        )
      })
      return newArray
    }
    const jsxGratitudeList = this.state.gratitudes.map(gratitude => {
      let gratOwner = ''
      for (let i = 0; i < this.state.users.length; i++) {
        if (gratitude.owner === this.state.users[i].id) {
          gratOwner = this.state.users[i].email
        }
      }
      const commentArray = []
      for (let j = 0; j < this.state.comments.length; j++) {
        if (this.state.comments[j].gratitude === gratitude.id) {
          commentArray.push(this.state.comments[j])
        }
      }
      const commentJsx = []
      commentJsx.push(commentToJsx(commentArray))
      return (
        <div key={gratitude.id} size="4" className="gratfeed">
          <div className='card-header'>
            <div className='owner'>
              <Link to={`/gratlist/${gratitude.owner}`}><h5 className= 'grat-owner'>{gratOwner}</h5></Link>
              <span className='editbtn'><DropdownButton
                as={InputGroup.Prepend}
                variant="primary"
                id="input-group-dropdown-1"
                title='...'
              >
                <Dropdown.Item name={gratitude.id} eventKey={gratitude.id} onClick={this.showEditModal}>Edit</Dropdown.Item>
                <Dropdown.Item name={gratitude.id} eventKey={gratitude.id} onClick={this.handleDeleteSubmit}>Delete</Dropdown.Item>
                <Dropdown.Item name='cancel'>Cancel</Dropdown.Item>
              </DropdownButton></span>
            </div>
            <div className='grat-feed-create-date'>
              <p>{moment(gratitude.created_at).format('LLLL')}</p>
            </div>
          </div>
          <div className='grat-feed-text'>
            <h5>
              {gratitude.text}
            </h5>
            <br/>
          </div>
          <div className="row">
            <div className="col-9 heart" ><Button variant="primary" className='heartbtn' key={gratitude.id} id={gratitude.id} onClick={this.onLike}>Like</Button>{gratitude.likes.length}</div>
            <div className='col-3 comment-bubble'> <Button className='commentbtn' onClick={this.showCommentModal} name={gratitude.id}>Comment</Button>{gratitude.comments.length}</div>
          </div>
          {commentJsx}
        </div>
      )
    })
    return (
      <div className='container'>
        <GratEdit show={this.state.showEdit} handleClose={this.hideEditModal}>
          <Col className='gratitude'>
            <Form onSubmit={this.handleEditSubmit}>
              <Form.Label className='textLabel'><h5>What are you grateful for?</h5></Form.Label>
              <Form.Control name="text" id="text" onChange={this.handleChange} type="text" value={this.state.gratitude.text} />
              <Button className='commentSubmitButton' type='submit'>Update</Button>
            </Form>
          </Col>
        </GratEdit>
        <GratComment show={this.state.showComment} handleClose={this.hideCommentModal}>
          <Col className='gratitude'>
            <Form onSubmit={this.handleCommentSubmit}>
              <Form.Label className='textLabel'><h5>Leave a comment...</h5></Form.Label>
              <Form.Control name="text" id="text" onChange={this.handleCommentChange} as="textarea" rows={3} placeholder='Add a comment...' />
              <Button className='commentSubmitButton' type='submit'>Submit</Button>
            </Form>
          </Col>
        </GratComment>
        <CommentEdit show={this.state.showCommentEdit} handleClose={this.hideEditCommentModal}>
          <Col className='gratitude'>
            <Form onSubmit={this.handleCommentEditSubmit}>
              <Form.Label className='textLabel'><h5>Update your comment...</h5></Form.Label>
              <Form.Control name="text" id="text" onChange={this.handleCommentEditChange} type="text" value={this.state.comment.text} />
              <Button className='commentSubmitButton' type='submit'>Update</Button>
            </Form>
          </Col>
        </CommentEdit>
        <GratCreate user={this.state.user} msgAlert={this.props.msgAlert} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>
        {jsxGratitudeList}
      </div>
    )
  }
}

export default GratFeed
