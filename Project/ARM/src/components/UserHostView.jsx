import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

// CREDITS: FontAwesome provides some awesome fonts. Their icons were used in
// this project. The idea to use FontAwesome comes from this video:
// https://www.youtube.com/watch?v=LoYbN6qoQHA

const UserHostView = ({user, position, deleteUser}) => {
  // User Host View can only delete, since it would be the host's perspective.
  const getReturnComponent = () => {
    let returnComponent;
    if (user.isEditing){
      returnComponent = <p onClick={() => deleteUser(user.ID)} className="display-name">{position}. {user.DisplayName} [Editing]</p>;
    }
    else{
      returnComponent = <p onClick={() => deleteUser(user.ID)} className="display-name">{position}. {user.DisplayName}</p>;
    };
    return returnComponent;
  };

  return (
    <div id='UserHostView'>
      {getReturnComponent()}
      <div>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(user.ID)}/>
      </div>
    </div>
  );
};

export default UserHostView;
