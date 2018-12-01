var mongoose = require("mongoose");
var User = mongoose.model("User");
var Task = mongoose.model("Task");

module.exports.fetchTask = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private access"
    });
  } else {
    console.log(req.body.id);
    Task
    .findById({_id:req.body.id})
    .populate('participants')
    // .populate('participants')
    // .populate('participatedTasks')
    .exec(function(err, task) {
      console.log(task);
      res.status(200).json(task);
    });

    // Task.findById({_id:req.body.id}, function(err,task){
    //   if(err)
    //     throw err;
    //   else 
    //     res.json({"task":task});
    // })
  }
}

module.exports.createTask = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private access"
    });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      var task = new Task();
      task.title = req.body.title;
      task.description = req.body.description;
      task.time = req.body.time;
      task.venue = req.body.venue;
      task.ownerId = user._id;

      if (req.body.participants.length != 0) {
        for (let i = 0; i < req.body.participants.length; i++) {
          console.log(req.body.participants[i]);
          task.participants.push(req.body.participants[i]);
        }
      } else {
        req.body.participants = [];
      }
      task.save((err, task) => {
        if (err) {
          throw err;
        } else {
          console.log(task);
            console.log(user);

    
          User.findOneAndUpdate(
            { _id: user.id }, 
            { $push: { ownedTasks: task._id  } },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } else {
                     
                    //  ======
                    if (req.body.participants.length != 0) {
                        for (let i = 0; i < req.body.participants.length; i++) {
                        
                            User.findOneAndUpdate(
                                { _id:  req.body.participants[i] }, 
                                { $push: { participatedTasks: task._id  } },
                               function (error, success) {
                                console.log(success);
                                
                               })
    
                               if(i==req.body.participants.length-1){
                                   res.json({"message":"task has been added succesfully"});
                               }
    
                         }
                    }
                    else{
                        res.json({"message":"task has been added succesfully"});
                    }
                 

                    //  =====
                 }
             });

        }
      });
    });
  }
};


module.exports.deleteTask = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
          message: "UnauthorizedError: private access"
        });
      } else {

        var taskId= req.body.taskId;
        console.log("*****taskId*********");
        console.log(taskId);
        console.log("**************");

        //   ==========
        Task.findById({_id:taskId},function(err,task){
            console.log("******task********");
            console.log(task);
            console.log("**************");
            if(err)
                throw err;
            else{
                var ownerId = task.ownerId;
                console.log("********ownerId******");
                console.log(ownerId);
                console.log("**************");
                User.findOneAndUpdate({_id:ownerId}, {$pull: {ownedTasks: task._id}}, function(err, data){
                    if(err) {
                      return res.status(500).json({'error' : 'error in deleting address'});
                    }
                    else{
                        console.log(data);
                        // res.json(data);
                        if(task.participants.length!=0){
                            for(let i=0;i<task.participants.length;i++){
                                var partId= task.participants[i];
                                User.findOneAndUpdate({_id:partId}, {$pull: {participatedTasks: task._id}}, function(err, data){
                                    if(err) {
                                      return res.status(500).json({'error' : 'error in deleting address'});
                                    }
                            
                                    
                                   if(i==task.participants.length-1){
                                    Task.remove({ _id: taskId }, function(err) {
                                        if (err) {
                                            throw err;
                                        }
                                        
                                        res.json({"message":"task has been deleted succesfully"});
                                        
                                    });
                                    
                                }
                            
                                  });
                            }
                        }else{
                            res.json({"message":"task has been deleted succesfully"});
                        }
                        
                    }
                    
            
                  });
            }
        })

        //   ==========
        // Task.remove({ _id: taskId }, function(err) {
        //     if (err) {
        //           throw err;
        //     }
        //     else{
        //         res.json({ "message":"task has been removed"});
        //     }
        // });

      }

}

module.exports.updateTask = function(req, res) {

    var taskId = req.body.taskId;
  console.log(taskId);
  console.log(req.body);
    var set = {};

    for (var field in req.body) {
      set[field] = req.body[field];
    }
    console.log(set);

    Task.update({ _id: taskId }, 
        {$set: set}, 
        function(err, data) {
            res.json({"message":data});
        });

}

