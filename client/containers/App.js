import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import "../scss/index.scss";

import HomePage from "../components/HomePage";
import SignUp from "../components/SignUp";
import Header from "../components/Header";
import LogIn from "../components/LogIn";
import { identifyLoggedUser } from "../store/actions";

import Loader from "../components/Loader";
import PageNotFound from "../components/PageNotFound";
import User from "../components/User";
import Admin from "../components/Admin";
import Test from "../components/User/TestDashboard";
import AddTest from "../components/Admin/AddTest";

function App(props) {
  const grantPermission = (requestedRoles) => {
    const permittedRoles = JSON.parse(localStorage.user).type;
    // const permittedRoles = props.currentUser.userType;
    return requestedRoles.includes(permittedRoles) ? 1 : "";
  };

  function UserBasedRouting({ component: Component, roles, ...rest }) {
    return (
      <>
        {grantPermission(roles) && (
          <Route
            {...rest}
            render={(props) => (
              <>
                <Component {...props} />
              </>
            )}
          />
        )}
        {!grantPermission(roles) && (
          <Route
            render={() => (
              <>
                <PageNotFound />
              </>
            )}
          />
        )}
      </>
    );
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = "SWOT";
    if (!props.isAuthDone && localStorage.user) {
      props.dispatch(identifyLoggedUser());
    }
  });

  let token = localStorage.user ? JSON.parse(localStorage.user).token : null;
  let type = props.UserType;

  return (
    <div>
      {token && props.isAuthInProgress ? (
        <Loader />
      ) : (
        <>
          {token && props.isAuthDone ? (
            <>
              <Header />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <UserBasedRouting
                  exact
                  path="/admin"
                  component={Admin}
                  roles={["admin"]}
                />
                <UserBasedRouting
                  exact
                  path="/admin/test"
                  component={AddTest}
                  roles={["admin"]}
                />

                <UserBasedRouting
                  exact
                  path="/user"
                  component={User}
                  roles={["user"]}
                />
                <UserBasedRouting
                  exact
                  path="/user/test"
                  component={Test}
                  roles={["user"]}
                />
                <Route component={PageNotFound} />
              </Switch>
            </>
          ) : (
            <>
              <Header />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/login" component={LogIn} />
                <Route component={PageNotFound} />
              </Switch>
            </>
          )}
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(App);
