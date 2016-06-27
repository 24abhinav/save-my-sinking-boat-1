import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import request from 'superagent'

import 'styles/postEditor.scss'
import * as postActions from 'actions/postActions'
import { apiServiceUrl } from 'config/api'

export class PostEditor extends Component {
  submit() {
    const {
      postNameInput: { value : postName },
      descriptionInput: { value : description },
      contentInput: { value : content }
    } = this.refs
    const { username, password, getPosts } = this.props
    request
      .post(`${apiServiceUrl}post`)
      .auth(username ,password)
      .send({
        name: postName,
        description,
        content,
        points: 0,
        author: username
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.error(err)
          return
        }
        getPosts()
      })
  }

  render() {
    const { alreadyLogin } = this.props
    if (alreadyLogin) {
      return (
        <div className='PostEditor'>
          <input
            ref='postNameInput'
            type='text'
            placeholder='postName'
          />
          <input
            className='description'
            ref='descriptionInput'
            type='text'
            placeholder='description'
          />
          <input
            className='content'
            ref='contentInput'
            type='text'
            placeholder='content'
          />
          <button className='button' onClick={this.submit.bind(this)} >
            Submit
          </button>
        </div>
      )
    } else {
      return (
        <p>Please login or signup for post submit</p>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    alreadyLogin: state.user.get('alreadyLogin'),
    username: state.user.get('username'),
    password: state.user.get('password')
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getPosts: postActions.getPosts
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor)
