import React, { Component } from "react";
import { Route } from "react-router-dom";
import Auth from "./auth/Auth";
import AuthContext from "./auth/AuthContext";
import SecureRoute from "./SecureRoute";
import ItemsPages from "./components/items/ItemsPage";
import LibrariesPages from "./components/libraries/LibrariesPage";
import UsersPages from "./components/users/UsersPage";
import HomePage from "./components/home/HomePage";
import Navbar from "./components/shared/Navbar";
import Error404 from "./components/Error404";
import Callback from "./Callback";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history), //let Auth-component use history
      tokenRenewalDone: false // keep track of TR request is finished
    };
  }

  // For silent authentication, runs before component loads
  componentDidMount() {
    this.state.auth.renewToken(() =>
      // when callback is returned, set tokenRD to complete
      this.setState({ tokenRenewalDone: true })
    );
  }

  render() {
    const { auth } = this.state; //
    if (!this.state.tokenRenewalDone) return "Waiting.... spinn....spinn";
    return (
      // sharing auth through Provider to children, not need to pass auth
      <AuthContext.Provider value={auth}>
        <Navbar auth={auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <HomePage auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={auth} {...props} />}
          />
          <SecureRoute path="/itemspage" component={ItemsPages} />
          <SecureRoute path="/userspage" component={UsersPages} />
          <SecureRoute path="/librariespage" component={LibrariesPages} />
          <Route component={Error404} />
        </div>
      </AuthContext.Provider>
    );
  } //render
}
export default App;
