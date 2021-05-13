import React, { Fragment, useState } from 'react';
import Message from './Message';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose CSV File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });
      console.log(uploadedFile);

      setMessage('File Upload Complete!');
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <Fragment className="row">
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit} className="col-sm-12 col-md-6 offset-md-3 mt-4">
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <input
          type='submit'
          value='Solve'
          className='btn btn-primary btn-block col-sm-6 col-md-3 offset-md-4 offset-sm-2 mt-4'
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
