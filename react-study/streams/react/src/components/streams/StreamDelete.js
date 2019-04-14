import React from 'react';
import Modal from '../Modal'
import history from '../../history'

const StreamDelete = () => {
  const actions = (
    <>
      <button className="ui negative button">Delete</button>
      <button className="ui button">Cancel</button>
    </>
  );

  return (
    <div>
      StreamDelete
      <Modal
        title="Delete Stream"
        content="Are you sure you want to delete Stream?"
        actions={actions}
        onDismiss={() => history.push('/')}
      />
    </div>
  );
};

export default StreamDelete;
