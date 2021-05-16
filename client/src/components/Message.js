import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {

  return (
    <div className={`alert ${props.type} fade show`} role='alert'>
      {props.msg}
    </div>
  );
};

Message.propTypes = {
  msg: PropTypes.string.isRequired
};

export default Message;
