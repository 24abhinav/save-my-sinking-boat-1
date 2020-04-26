import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import request from "superagent";

import "styles/commentEditor.scss";
import * as postActions from "actions/postActions";
import { apiServiceUrl } from "config/api";

export class CommentEditor extends Component {
  submit() {
    const {
      contentInput: { value: content },
      indicatorText,
      submitBtn
    } = this.refs;

    if (!content) {
      indicatorText.innerHTML = "Please write an answer";
      return;
    }

    submitBtn.disabled = true;
    indicatorText.innerHTML = "Request sending.";

    const { username, password, postId, commentUploaded } = this.props;
    request
      .post(`${apiServiceUrl}comment`)
      .auth(username, password)
      .send({
        content,
        author: username,
        postId
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
        indicatorText.innerHTML = "Thanks for your answer!!";
        this.refs.contentInput.value = "";
        commentUploaded && commentUploaded();
      });
  }

  render() {
    const { alreadyLogin } = this.props;
    return (
      <div className="CommentEditor">
        {alreadyLogin ? (
          <div>
            <input
              className="content"
              ref="contentInput"
              type="text"
              placeholder="Answer"
            />
            <button
              className="button"
              onClick={this.submit.bind(this)}
              ref="submitBtn"
            >
              Submit
            </button>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "red" }}>
            PLEASE LOGIN OR SIGNUP TO POST AN ANSWER.
          </p>
        )}
        <p ref="indicatorText"></p>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
