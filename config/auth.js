// No clue what this is below...

// module.exports = {
//   facebookAuth: {
//     clientID: '145437622689007',
//     clientSecret: '9ebb64affd080bd5b076329e2759cb34',
//     callbackURL: 'http://localhost:3000/auth/facebook/callback',
//   }
// };


module.exports = {
  facebookAuth: {
    clientID: '700876983441574',
    clientSecret: '7fe890bd8cf352a37cf062c94b35a063',
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
  }
};
