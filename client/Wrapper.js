import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import {store} from './store/index';
import { Provider } from 'react-redux';

export default function Wrapper({children}){
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}