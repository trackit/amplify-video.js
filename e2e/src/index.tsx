import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Amplify imports
import Amplify from 'aws-amplify';
import Video from 'amplify-video.js/dist';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';

Amplify.configure({ ...awsconfig, signedUrl: true });
Amplify.register(Video);

ReactDOM.render(
  <React.StrictMode>
    <AmplifyAuthenticator>
      <App />
    </AmplifyAuthenticator>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
