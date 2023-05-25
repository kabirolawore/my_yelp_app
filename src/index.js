import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import awsExports from './aws-exports';
import { Amplify } from 'aws-amplify';

Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
