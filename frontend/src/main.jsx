import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import Routers from './routes/Routers';
import ChatProvider from './context/ChatProvide';



ReactDOM.createRoot(document.getElementById('root')).render(
  <ChatProvider>
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Routers />
        </Router>
      </Provider>
    </React.StrictMode>
  </ChatProvider>
);
