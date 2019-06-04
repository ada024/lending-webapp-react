import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login"; // konstant som brukes til login history og for å unngå typos

// private properties
// eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {
  constructor(history) {
    this.history = history;
    this.requestedScopes = "openid email";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScopes
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location) // lagrer nåværende nettside til LStrg
    );
    this.auth0.authorize();
  };

  // this method wil store navigation entry in memory & redirect
  handleAuthentiaction = () => {
    // parseHash convert URL from Base64 to read-string & stores as autResult
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult); // Stores values from authResult in browse-memory
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
            ? "/" // if undefined redirect to login
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.history.push(redirectLocation); //send to stored page from LSrg
      } else if (err) {
        this.history.push("/"); // if unexpected also send to login
        alert(
          `Error: ${err.error}. More details about the error in console.log`
        );
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN); // remove stored entry
    });
  }; //handleAuthe

  setSession = authResult => {
    // times 1000 for milliseconds
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    _scopes = authResult.scope || this.requestedScopes || "";

    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;
    this.scheduleTokenRenewal(); // Begin token renewal
  }; // setSession

  isAuthenticated() {
    return new Date().getTime() < _expiresAt; // returning boolean
  }

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID, // Log out from Auth-server
      returnTo: "http://localhost:3000" // Also redirect to home
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error("Missing  access token!");
    }
    return _accessToken;
  };

  userHasScopes(scopes) {
    const grantedScopes = (_scopes || "").split(" ");
    return scopes.every(scope => grantedScopes.includes(scope));
  }

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (cb) cb(err, result);
    });
  } //renewToken

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now(); // countdown
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  } // scheduleTokenRenewwal
} // auth
