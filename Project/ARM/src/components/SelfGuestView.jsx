import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const SelfGuestView = ({user, position, deleteSelf, toggleEditing}) => { 
  return (
    <div className='SelfGuestView'>
      <p onClick={() => deleteSelf()} className="displayName">{position}. {user.DisplayName} [You]</p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => toggleEditing()}/>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteSelf()}/>
      </div>
    </div>
  )
}

export default SelfGuestView