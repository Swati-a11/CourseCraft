import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import App from './App';
import './App.css';
import { store } from './stores/store';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardDataProvider } from './context/DashboardDataContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <DashboardDataProvider>
            <Toaster position="top-right" />
            <App />
          </DashboardDataProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);