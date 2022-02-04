export default {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) =>
      !loggedInUser ? false : userId === loggedInUser.id,
  },
};
