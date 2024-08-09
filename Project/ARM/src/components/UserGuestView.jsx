import React from 'react';

const UserGuestView = ({user, position}) => {
  const getReturnComponent = () => {
    let returnComponent;
    if (user.isEditing){
      returnComponent = <p>{position}. {user.DisplayName} [Editing]</p>;
    }
    else{
      returnComponent = <p>{position}. {user.DisplayName}</p>;
    }
    return returnComponent;
  }
  
  return (
    <div id='UserGuestView'>
      {getReturnComponent()}
    </div>
  )
}

export default UserGuestView