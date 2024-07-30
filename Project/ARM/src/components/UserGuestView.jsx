import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const UserGuestView = ({user, position, deleteUser, toggleEditing}) => {
  return (
    <div className='UserGuestView'>
      <p onClick={() => deleteUser(user.id)}>{position}. {user.name}</p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => toggleEditing(user.id)}/>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(user.id)}/>
      </div>
    </div>
  )
}

export default UserGuestView