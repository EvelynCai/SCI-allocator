import React, { Fragment, useState } from 'react';
import Message from './Message';
import axios from 'axios';

const FileUpload = () => {
  const [demandFile, setDemandFile] = useState('');
  const [supplyFile, setSupplyFile] = useState('');
  const [optionalFile, setOptionalFile] = useState('');
  const [supplyFilename, setSupplyFilename] = useState('Choose CSV File about Supply');
  const [demandFilename, setDemandFilename] = useState('Choose CSV File about Demand');
  const [optionalFilename, setOptionalFilename] = useState('Choose other optional CSV File');
  // const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');

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

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('supplyFile', supplyFile);
    formData.append('demandFile', demandFile);
    formData.append('optionalFile', optionalFile);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      // const { fileName, filePath } = res.data;

      // setUploadedFile({ fileName, filePath });

      setMessage('File Upload Complete!');
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
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
          type='submit'
          value='Solve'
          disabled={!isSolvable}
          className='btn btn-primary btn-block col-sm-6 col-md-3 offset-md-4 offset-sm-2 mt-4'
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
