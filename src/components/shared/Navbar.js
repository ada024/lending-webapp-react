import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    const { isAuthenticated, login, logout } = this.props.auth; // shortening
    return (
      <nav>
        <ul>
          {isAuthenticated() && (
            <li>
              <Link to="/itemspage">Items</Link>
            </li>
          )}
          {isAuthenticated() && (
            <li>
              <Link to="/userspage">Uesers</Link>
            </li>
          )}
          {isAuthenticated() && (
            <li>
              <Link to="/librariespage">Libraries</Link>
            </li>
          )}
          <li>
            <button onClick={isAuthenticated() ? logout : login}>
              {isAuthenticated() ? "Log Out" : "Login In"}
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
