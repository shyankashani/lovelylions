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
    clientID: '1229026683890617',
    clientSecret: '29341e4c961c4aec6279551b832448a5',
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
  }
};
