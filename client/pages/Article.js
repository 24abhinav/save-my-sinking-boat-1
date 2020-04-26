import React, { Component } from "react";
import request from "superagent";

import { apiServiceUrl } from "config/api";
import CommentEditor from "components/CommentEditor";
import "styles/article.scss";

export default class Article extends Component {
  constructor() {
    super();
    this.state = {
      name,
      content: "",
      author: undefined,
      comments: [],
      points: 0,
      upVoted: false,
      downVoted: false
    };
  }

  componentWillMount() {
    this.updateArticle();
  }

  updateArticle() {
    const { id } = this.props.params;
    request
      .post(`${apiServiceUrl}article`)
      .send({ id })
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        if (res.body.err) {
          console.error(res.body.err);
          return;
        }
        const { name, author, content, comments } = res.body.data;
        this.setState({ name, author, content, comments });
      });
  }

  modifyPoints(isUpvote, isPost, commentId) {
    const { username, password } = this.props.location.state;
    const { id } = isPost? this.props.params : {id: commentId};
    let path = isPost? "post": "comment";
    request
      .put(`${apiServiceUrl}${path}`)
      .auth(username, password)
      .send({ id, pointInc: isUpvote ? 1 : -1 })
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        const { err: resErr, data } = res.body;
        if (!resErr) {
          if (isPost) {
            this.setState({
              modPoints: data.points,
              upVoted: isUpvote,
              downVoted: !isUpvote
            });
          } else {
            this.setState({
              ansPoints: data.points,
              ansUpVoted: isUpvote,
              ansDownVoted: !isUpvote
            });
          }
        }
      });
  }

  render() {
    const { id } = this.props.params;
    const { alreadyLogin, points } = this.props.location.state;
    const {
      content,
      author,
      name,
      comments,
      upVoted,
      downVoted,
      modPoints,
      ansPoints,
      ansUpVoted,
      ansDownVoted
    } = this.state;
    return (
      <div className="Article" style={{ margin: 0 }}>
        <div
          style={{ marginBottom: "20px", boxShadow: "3px 3px 5px 6px #ccc" }}
        >
          <div
            style={{ textAlign: "center", marginRight: "10px" }}
            className="float-left"
          >
            <button
              onClick={
                alreadyLogin && !upVoted && this.modifyPoints.bind(this, true, true)
              }
              style={{ color: "green" }}
              className="vote-button fa fa-arrow-up"
            />
            <p style={{ margin: 0, fontSize: "x-large" }} className="points">
              <kbd>
                <strong>{modPoints || points}</strong>
              </kbd>
            </p>
            <button
              onClick={
                alreadyLogin &&
                !downVoted &&
                this.modifyPoints.bind(this, false, true)
              }
              style={{ color: "red" }}
              className="vote-button fa fa-arrow-down"
            />
          </div>
          {name && (
            <h2 style={{ textAlign: "left", marginBottom: 0 }}>{name}</h2>
          )}
          {
            <p className="content post" style={{ margin: 0 }}>
              {content}
            </p>
          }
          {author && (
            <blockquote
              className="author blockquote"
              style={{ margin: 0, border: 0, textAlign: "right" }}
            >
              Asked By: {author}
            </blockquote>
          )}
        </div>
        <ul className="comment-area" style={{ margin: 0 }}>
          <h4>Answers</h4>
          {comments.map((d, key) => {
            return (
              <li
                key={key}
                className="comment"
                style={{
                  border: 0,
                  boxShadow: "0px 2px 2px #888, 0px -2px 2px #888",
                  marginBottom: "10px",
                  display: "flex"
                }}
              >
                <div style={{ textAlign: "center" }} className="float-left">
                  <button
                    onClick={alreadyLogin && !ansUpVoted && this.modifyPoints.bind(this, true, false, d._id)}
                    style={{ color: "green" }}
                    className="vote-button fa fa-arrow-up"
                  />
                  <p
                    style={{ margin: 0, fontSize: "x-large" }}
                    className="points"
                  >
                    <kbd>
                      <strong>{ansPoints || d.points || 0}</strong>
                    </kbd>
                  </p>
                  <button
                    onClick={
                      alreadyLogin && !ansDownVoted && this.modifyPoints.bind(this, false, false, d._id)
                    }
                    style={{ color: "red" }}
                    className="vote-button fa fa-arrow-down"
                  />
                </div>
                <div
                  className="float-left"
                  style={{
                    textAlign: "left",
                    width: "100%",
                    marginLeft: "10px"
                  }}
                >
                  <p className="content" style={{ margin: 0, height: "60%" }}>
                    {d.content}
                  </p>
                  <blockquote
                    className="author blockquote"
                    style={{ margin: 0, border: 0, textAlign: "right" }}
                  >
                    Answered By: {d.author}
                  </blockquote>
                </div>
              </li>
            );
          })}
        </ul>
        <CommentEditor
          commentUploaded={this.updateArticle.bind(this)}
          postId={id}
        />
      </div>
    );
  }
}
