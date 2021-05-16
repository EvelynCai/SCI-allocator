import React, { Fragment, useState, useEffect } from 'react';
import Message from './Message';
import axios from 'axios';
import Table from "react-table-lite";
import "./FileUpload.css";
// import Exporter from 'data-exporter'; // for download

const FileUpload = () => {
  const [demandFile, setDemandFile] = useState('');
  const [supplyFile, setSupplyFile] = useState('');
  const [optionalFile, setOptionalFile] = useState('');
  const [supplyFilename, setSupplyFilename] = useState('Choose CSV File about Supply');
  const [demandFilename, setDemandFilename] = useState('Choose CSV File about Demand');
  const [optionalFilename, setOptionalFilename] = useState('Choose other optional CSV File');
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('alert-info');

  const isSolvable = (supplyFile !== '') && (demandFile !== '');

  const onSupplyChange = e => {
    setSupplyFile(e.target.files[0]); 
    setSupplyFilename(e.target.files[0].name);
  };
  const onDemandChange = e => {
    setDemandFile(e.target.files[0]);  
    setDemandFilename(e.target.files[0].name);
  };
  const onOptionalChange = e => {
    setOptionalFile(e.target.files[0]);  
    setOptionalFilename(e.target.files[0].name);
  };

  useEffect(() => {
    setMessage(message);
    setMessageType(messageType);
  }, [message]);

  const onSubmit = async e => {
    e.preventDefault();
    // construct POST formData
    const formData = new FormData();
    formData.append('supplyFile', supplyFile);
    formData.append('demandFile', demandFile);
    formData.append('optionalFile', optionalFile);

    try {
      // send POST request
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      // display response
      if (res.data && Object.keys(res.data).length === 0 && res.data.constructor === Object) {
        setMessageType('alert-warning');
        setMessage('Sorry, there is NO optimal solution in this case.');
      } else {
        setMessageType('alert-info');
        setMessage('Scroll down to view the table of our optimal solution.');
        
        let solution = [];
        solution.push(res.data);
        setShowSolution(true);
        setSolution(solution);
      }
    } catch (err) {
      console.error(err);
      setMessageType('alert-danger');
      setMessage('An error occurs, please try again later.');
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} type={messageType} /> : null}
      <form onSubmit={onSubmit} className="col-sm-12 col-md-6 offset-md-3 mt-4">
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='supplyFile'
            onChange={onSupplyChange}
          />
          <label className='custom-file-label' htmlFor='supplyFile'>
            {supplyFilename}
          </label>
        </div>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='demandFile'
            onChange={onDemandChange}
          />
          <label className='custom-file-label' htmlFor='demandFile'>
            {demandFilename}
          </label>
        </div>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='optionalFile'
            onChange={onOptionalChange}
          />
          <label className='custom-file-label' htmlFor='optionalFile'>
            {optionalFilename}
          </label>
        </div>

        <input
          id='solve-button'
          type='submit'
          value='Solve'
          disabled={!isSolvable}
          className='btn btn-primary btn-block col-sm-6 col-md-3 offset-md-4 offset-sm-2 mt-4'
        />
      </form>
      { showSolution &&
        <Table
          id='solution-table'
          data = {solution}		
          header = {["f_1", "f_2", "f_3", "f_4", "x11","x12","x21","x22"]} 
          sortBy = {["x11"]}
          searchable={true}
          searchBy={["x11"]} 
          download = {true}
          fileName = {"optimal-solution.csv"}
          noDataMessage={"NO solution at present, please upload CSV files to start optimization."}
          limit = {10}
          containerStyle = {{padding: '3rem'}}
          headerStyle = {{backgroundColor: '#282c34', color: 'white', borderColor: '#282c34'}}
        />
      } 
    </Fragment>
  );
};

export default FileUpload;
