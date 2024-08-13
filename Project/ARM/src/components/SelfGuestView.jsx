import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

const SelfGuestView = ({user, position, deleteSelf, toggleEditing}) => {
  // Self Guest View can be both edited and deleted by the user (since it's themselves).
  return (
    <div id='SelfGuestView'>
      <p onClick={() => deleteSelf()} className="display-name">{position}. {user.DisplayName} [You]</p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => toggleEditing()}/>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteSelf()}/>
      </div>
    </div>
  );
};

export default SelfGuestView;
