import React, { Component } from "react";
import { Link } from "react-router-dom";

class HomePage extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return <h1>Login</h1>;
  }
}

export default HomePage;
