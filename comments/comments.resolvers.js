export default {
    Comment: {
    //   isMine: ({ userId }, _, { loggedInUser }) => {
    //       if(!loggedInUser) {
    //           return false;
    //       }
    //     return userId === loggedInUser.id;
    //   }
        isMine: ({userId}, _, {loggedInUser}) => userId === loggedInUser?.id
    },
  };