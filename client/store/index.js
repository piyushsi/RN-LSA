import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import userReducer from "./reducer/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
});

export const  store = createStore(rootReducer, applyMiddleware(thunk));