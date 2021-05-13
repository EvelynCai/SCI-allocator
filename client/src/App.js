import React from 'react';
import FileUpload from './components/FileUpload';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="App">
    <div className='App-header'>
    <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Supply Chain Integration Allocator
        </h1>
    </div>
    <FileUpload />
  </div>
);

export default App;
