---
title: Authenticating users with oauth, hooks and context
date: "2019-05-08T22:12:03.284Z"
---

With the release of React hooks, creating auth flows has become much simpler. The following tutorial shows a way to allow users to login to an application using oauth, as well as being able to access information about the logged in user from any component in the application using context.

## Authentication

For this tutorial, we are going to be using [Auth0](https://auth0.com/). This handles authentication of users, as well as securely persisting users information. Go ahead and create an account, and create a new application, which will give you access to an `access_token`, and `id_token`.

`Auth0` has a great `javaScript` SDK, which contains the methods we will need to handle authentication. Run the following command to install the SDK:

```bash
npm install auth0-js
```

We are going to use the [React hooks API](https://reactjs.org/docs/hooks-intro.html), to create a `useAuth` hook, which will create an instance of an `Auth0` class, and return any methods we will need, making them available to use by other React components. Create a `useAuth.js` file, and add the following code. I would reccommend typing the code out, rather than copying and pasting, just to help the syntax sink in.

```javascript
// useAuth.js
import auth0, { Auth0DecodedHash } from "auth0-js"
import { useState } from "react"

const useAuth = () => {
  // We define expiresAt as a piece of state
  const [expiresAt, setExpiresAt] = useState(0)

// Instantiate a new auth0.WebAuth class. This class
// contains the method we will need to handle our authentication flow.
  const Auth0 = new auth0.WebAuth({
    clientID: // your clientID here,
    domain: // you Auth0 domain here,
    // Where to redirect once the authentication is complete
    redirectUri: 'http://localhost:8000',
    responseType: "token id_token",
    scope: "openid",
  })

// This function calls parseHash, which redirects the user to the Auth0
// login tile, then redirects back to the redirectUri defined earlier,
// and calls the callback function defined with an authResult object,
// containing access token, idToken, and expiresIn properties.
  const handleAuthentication = () => {
    Auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult)
      }
      if (err) {
        throw new Error(err.error)
      }
    })
  }

// Sets the expiresIn value in state
  const setSession = authResult => {
    if (authResult.expiresIn) {
      const expires = authResult.expiresIn * 1000 + new Date().getTime()
      setExpiresAt(expires)
    }
  }


  const renewSession = () => {
    Auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult)
      } else if (err) {
        logout()

        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        )
      }
    })
  }

// Removes the current logged in user, as well as the
// expiresAt from state
  const logout = () => {
    Auth0.logout({
      returnTo: window.location.origin,
    })
    setExpiresAt(0)
  }

// Lets us know if the logged in users session is still active
  const isAuthenticated = () => {
    return new Date().getTime() < expiresAt
  }

// Return an object containing methods that will be needed
// when a user logs in or logs out
  return {
    authenticate: () => handleAuthentication(),
    isAuthenticated: () => isAuthenticated(),
    login: () => Auth0.authorize(),
    logout: () => logout(),
  }
}

export default useAuth
```

Take some time to digest the above code, there is a lot going on! This hook will allow us to initiate a login and logout flow for users on our application. We now need to pass these methods to anywhere in our application that will need it. To do this, we will use the [React context API](https://reactjs.org/docs/context.html).

This will essentially invole creating a React component, that will contain some state, which will be available to any of its child components that subscribe to it. The introduction of React's built in `useContext` hook, has made this API even easier to use than it was before.

We will need to create an `AuthProvider.js` file, with the following code:

```javascript
// AuthProvider.js
import React from "react"
import useAuth from "./useAuth"

// This creates a React context object. The createContext
// function is called with the default state (in our case {})
export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  // Call our useAuth hook
  const auth = useAuth()
  // Create a React context component, with the state(value prop) being the object
  // returned from our useAuth hook.
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
```

To make `AuthContext` as widely available as possible, we need to wrap our application in our newly created `AuthProvider`. In our case, `App.js` is our top level component, so it makes sense to place `AuthProvider` here:

```javascript
// App.js
import React from "react"
import { AuthProvider } from "./AuthProvider"
import Login from "./Login"

const App = () => {
  return (
    <AuthProvider>
      {/* children have access to Auth context */}
      <Login />
    </AuthProvider>
  )
}
```

Our `AuthProvider` has now made the Auth context available to any of its childrebn. Lets go ahead and create the `Login` component defined above, and access the Auth context using the `useContext` hook:

```javascript
// Login.js
import React, { useContext } from "react"
import { AuthContext } from "./AuthProvider.js"

const Login = () => {
  // React hook to access context
  const auth = useContext(AuthContext)

  return (
    <div>
      <button onClick={auth.login}>LOGIN</button>
      {auth.isAuthenticated() && <button onClick={auth.logout}>LOGOUT</button>}
    </div>
  )
}
```

This component will render a `LOGIN` button if the user is logged out, and `LOGOUT` if they are logged in. This pattern can be used throughout an application to create views for logged in / logged out users, and is made much simpler with context and hooks!

The real power of the context API becomes more apparent as your application begins to grow. There is no need to pass `Auth` to any component as a prop, therefore eliminating any risk of confusion regarding prop drilling in the future.

## Further reading

- [Roles and permissions](https://auth0.com/docs/authorization/guides/manage-permissions)
- [oauth](https://oauth.net/)
