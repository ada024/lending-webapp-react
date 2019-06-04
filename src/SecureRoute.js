import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "./auth/AuthContext";

function SecureRoute({ component: Component, ...rest }) {
  return (
    <AuthContext.Consumer>
      {(
        auth // auth-object shared by AuthContext.Provider
      ) => (
        <Route
          {...rest}
          render={props => {
            // 1. If not loged in, redirect to login
            if (!auth.isAuthenticated()) return auth.login();

            // 3. Render component
            return <Component auth={auth} {...props} />;
          }}
        />
      )}
    </AuthContext.Consumer>
  );
}

SecureRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default SecureRoute;
