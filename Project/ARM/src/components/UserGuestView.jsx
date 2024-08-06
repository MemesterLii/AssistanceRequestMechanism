import React from 'react';

const UserGuestView = ({user, position}) => {
  const getReturnComponent = () => {
    let returnComponent;
    if (user.isEditing){
      returnComponent = <p>{position}. {user.DisplayName} is editing their name...</p>;
    }
    else{
      returnComponent = <p>{position}. {user.DisplayName}</p>;
    }
    return returnComponent;
  }
  
  return (
    <div className='UserGuestView'>
      {getReturnComponent()}
    </div>
  )
}

export default UserGuestView