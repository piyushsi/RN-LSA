import Axios from "axios";

import {
  IDENTIFY_USER,
  LOGOUT_USER,
  LOGIN_USER,
  UPDATE_LOGGED_USER,
  USER_AUTH_IN_PROGRESS,
} from "./types";

import { store } from "./index";

export let fetchLoggedUser = (payload) => {
  return { type: IDENTIFY_USER, payload };
};

export let logoutUser = (payload) => {
  return { type: LOGOUT_USER, payload };
};

export let loginUser = (payload) => {
  return { type: LOGIN_USER, payload };
};

export let updateLoggedUser = (payload) => {
  return { type: UPDATE_LOGGED_USER, payload };
};

export let userAuthProgress = (payload) => {
  return { type: USER_AUTH_IN_PROGRESS, payload };
};

export let userSignUp = (payload) => {
  return function () {
    store.dispatch(
      userAuthProgress({ isAuthInProgress: true, isAuthDone: false })
    );
    return Axios.post("/api/v1/user/signup", { ...payload }).then((res) => {
      console.log(res);
      if (res.data.success) {
        console.log(res, "signup successful");
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: res.data.token,
            type: res.data.data.userType,
          })
        );
        store.dispatch(
          loginUser({
            currentUser: res.data.data,
            isAuthInProgress: false,
            isAuthDone: true,
            userType: res.data.data.userType,
          })
        );
      } else if (!res.data.success) {
        console.log(res, "signup failed");
        store.dispatch(
          userAuthProgress({
            isAuthInProgress: false,
            isAuthDone: false,
          })
        );
      }
      return res.data;
    });
  };
};

export let userLogin = (payload) => {
  return function () {
    store.dispatch(
      userAuthProgress({ isAuthInProgress: true, isAuthDone: false })
    );
    return Axios.post("/api/v1/user/login", { ...payload }).then((res) => {
      if (res.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: res.data.token,
            type: res.data.data.userType,
          })
        );
        store.dispatch(
          loginUser({
            currentUser: res.data.data,
            isAuthInProgress: false,
            isAuthDone: true,
            userType: res.data.data.userType,
          })
        );
      } else if (!res.data.success) {
        console.log(res, "login failed");
        store.dispatch(
          userAuthProgress({
            isAuthInProgress: false,
            isAuthDone: false,
          })
        );
      }
      return res.data;
    });
  };
};

export let identifyLoggedUser = () => {
  return function () {
    store.dispatch(
      userAuthProgress({ isAuthInProgress: true, isAuthDone: false })
    );
    return Axios.get("/api/v1/user/me", {
      headers: { authorization: JSON.parse(localStorage.user).token },
    })
      .then((res) => {
        if (res.data.success) {
          store.dispatch(
            loginUser({
              currentUser: res.data.user,
              isAuthInProgress: false,
              isAuthDone: true,
              userType: res.data.user.userType,
            })
          );
        } else if (!res.data.success) {
          console.log(res, "signup failed");
          store.dispatch(
            userAuthProgress({
              isAuthInProgress: false,
              isAuthDone: false,
            })
          );
        }
        return res.data;
      })
      .catch((err) => console.log(err, "invalid user"));
  };
};
