var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.searchUsers = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      var param = req.body.param;
    User
      .find({name:{ "$regex": param, "$options": "i" }})
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};
