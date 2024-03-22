export const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };
  export const getSenderImage = (loggedUser, users) => {
    const result  =  users[0]._id === loggedUser._id ? users[1].profilePic?.url : users[0].profilePic?.url;
    return result ? result : "/img/profile_icon.jpeg";
  };
  export const getSenderUserName = (loggedUser, users) => {
  return  users[0]._id === loggedUser._id ? users[1].userName : users[0].userName
  };
  
