import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import request from "superagent";

import { apiServiceUrl } from "config/api";
import "styles/post.scss";

class Post extends Component {
  constructor() {
    super();
    this.state = { points: 0, upVoted: false, downVoted: false };
  }

  componentWillMount() {
    this.setState({ points: this.props.points });
  }

  modifyPoints(isUpvote) {
    const { username, password, id } = this.props;

    request
      .put(`${apiServiceUrl}post`)
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
          this.setState({
            points: data.points,
            upVoted: isUpvote,
            downVoted: !isUpvote
          });
        }
      });
  }

  render() {
    const { alreadyLogin, name, id, author, username, password } = this.props;
    const { points, upVoted, downVoted } = this.state;
    return (
      <div
        style={{
          border: 0,
          boxShadow: "0px 2px 2px #888, 0px -2px 2px #888",
          display: "flex"
        }}
        className="Post"
      >
        <div style={{ textAlign: "center" }} className="float-left">
          <button
            onClick={
              alreadyLogin && !upVoted && this.modifyPoints.bind(this, true)
            }
            style={{ color: "green" }}
            className="vote-button fa fa-arrow-up"
          />
          <p style={{ margin: 0, fontSize: "x-large" }} className="points">
            <kbd>
              <strong>{points}</strong>
            </kbd>
          </p>
          <button
            onClick={
              alreadyLogin && !downVoted && this.modifyPoints.bind(this, false)
            }
            style={{ color: "red" }}
            className="vote-button fa fa-arrow-down"
          />
        </div>
        <div
          className="float-left"
          style={{ textAlign: "left", width: "100%" }}
        >
          <Link
            to={{
              pathname: `article/${id ? id : "0"}`,
              state: { points, alreadyLogin, username, password }
            }}
            className="title"
          >
            {name}
          </Link>
          {author ? (
            <blockquote
              style={{ margin: 0, border: 0, textAlign: "right" }}
              className="blockquote"
            >{`Asked By: ${author}`}</blockquote>
          ) : (
            ""
          )}
        </div>
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

export default connect(mapStateToProps)(Post);
