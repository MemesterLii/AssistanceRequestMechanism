import React from 'react';

const UserGuestView = ({user, position}) => {
  // User Guest View is read only, no editing nor deleting (since it's other users and not the user themselves).
  const getReturnComponent = () => {
    let returnComponent;
    if (user.isEditing){
      returnComponent = <p>{position}. {user.DisplayName} [Editing]</p>;
    }
    else{
      returnComponent = <p>{position}. {user.DisplayName}</p>;
    };
    return returnComponent;
  };
  
  return (
    <div id='UserGuestView'>
      {getReturnComponent()}
    </div>
  );
};

export default UserGuestView;
