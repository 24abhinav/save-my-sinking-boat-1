import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import request from "superagent";

import "styles/postEditor.scss";
import * as postActions from "actions/postActions";
import { apiServiceUrl } from "config/api";

export class PostEditor extends Component {
  submit() {
    const {
      postNameInput: { value: postName },
      contentInput: { value: content },
      indicatorText,
      submitBtn
    } = this.refs;
    if (!postName) {
      indicatorText.innerHTML = "Please write a subject";
      return;
    }
    if (!content) {
      indicatorText.innerHTML = "Please write the question";
      return;
    }

    submitBtn.disabled = true;
    indicatorText.innerHTML = "Request sending.";

    const { username, password, getPosts } = this.props;
    request
      .post(`${apiServiceUrl}post`)
      .auth(username, password)
      .send({
        name: postName,
        description: "-",
        content,
        points: 0,
        author: username
      })
      .set("Accept", "application/json")
      .end((err, res) => {
        submitBtn.disabled = false;
        if (err) {
          indicatorText.innerHTML = "Sorry, some thing broken in server!";
          console.error(err);
          return;
        }
        if (res.body.err) {
          indicatorText.innerHTML = res.body.err;
          return;
        }
        this.refs.postNameInput.value = "";
        this.refs.contentInput.value = "";
        indicatorText.innerHTML = "Question posted successfully!";
        getPosts();
      });
  }

  render() {
    const { alreadyLogin } = this.props;
    if (alreadyLogin) {
      return (
        <div className="PostEditor">
          <input
            ref="postNameInput"
            type="text"
            placeholder="Question Subject"
          />
          <input
            className="content"
            ref="contentInput"
            type="text"
            placeholder="Question Description"
          />
          <button
            className="button"
            onClick={this.submit.bind(this)}
            ref="submitBtn"
          >
            Submit
          </button>
          <p ref="indicatorText"></p>
        </div>
      );
    } else {
      return (
        <p style={{ textAlign: "center", color: "red" }}>
          PLEASE LOGIN OR SIGNUP TO POST A QUESTION.
        </p>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    alreadyLogin: state.user.get("alreadyLogin"),
    username: state.user.get("username"),
    password: state.user.get("password")
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPosts: postActions.getPosts
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);
