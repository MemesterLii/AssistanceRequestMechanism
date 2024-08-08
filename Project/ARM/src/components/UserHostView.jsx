import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const UserHostView = ({user, position, deleteUser}) => {
  const getReturnComponent = () => {
    let returnComponent;
    if (user.isEditing){
      returnComponent = <p onClick={() => deleteUser(user.ID)}>{position}. {user.DisplayName} [Editing]</p>;
    }
    else{
      returnComponent = <p onClick={() => deleteUser(user.ID)}>{position}. {user.DisplayName}</p>;
    }
    return returnComponent;
  }

  return (
    <div className='UserHostView'>
      {getReturnComponent()}
      <div>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(user.ID)}/>
      </div>
    </div>
  )
}

export default UserHostView