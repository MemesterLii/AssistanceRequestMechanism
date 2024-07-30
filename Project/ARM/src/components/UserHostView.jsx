import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const UserHostView = ({user, position, deleteUser}) => {
  return (
    <div className='UserHostView'>
      <p onClick={() => deleteUser(user.ID)}>{position}. {user.DisplayName}</p>
      <div>
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(user.ID)}/>
      </div>
    </div>
  )
}

export default UserHostView