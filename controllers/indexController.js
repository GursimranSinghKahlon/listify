
var floatbox = require('../models/floatbox.js');

exports.home_get = function(req, res){
  res.render("home");
}

exports.floatship_page_get = function(req, res){
  res.render("floatship");
}


function floatbox_add(req, res) {
  console.log("adding floatship: ",req.params,req.body,req.body.floatship);
  floatbox.create(req.body.floatship, function(err, newfloat){
    if(err){
      console.log(err);
      //req.flash("error",err.name);
      res.send("error");
    } else {
      req.session.name = req.params.name;
      console.log("newfloat added", newfloat); 
      console.log("session added", req.session);   
      //req.flash("success",'Query sent');
      res.send("newly_created");
      //res.redirect('/float/'+req.body.floatship.name+'/'+req.body.floatship.password);
    }
  });
};

exports.floatbox_delete = function(req, res) {
  floatbox.findOneAndDelete({"name": req.params.name}, function(err, newfloat){
    if(err){
      console.log(err);
      //req.flash("error",err.name);
      res.send("error");
    } else {
      console.log("float deleted", newfloat);
      //req.flash("success",'Query sent');
      res.redirect('/');
    }
  });
};

exports.float_get = function(req, res) {
  console.log("getting floatship: ",req.body,req.body.floatship);
  floatbox.findOne({"name": req.params.name}, function(err, foundfloat){
    if(err){
      console.log(err);
      //req.flash("error","Error occured!")
      res.send("error");
    }else if(!foundfloat){
      console.log("not found",foundfloat);
      //res.send("not_found");
      floatbox_add(req,res);
    }else{
      console.log("matching pass",foundfloat);
      if(foundfloat.password == req.params.password){
          req.session.name = req.params.name;
          console.log("session added", req.session); 
          console.log("pass matched", foundfloat);
          res.send(foundfloat);
      }
      else{
        console.log("wrong_password");
        res.send("wrong_password");
      }
    }
  });
};


exports.float_add = function(req, res) {

  console.log("session added", req.session);
  if(req.session.name){
      var name = req.session.name;
      //newfloatbox.name = req.session.name;

      floatbox.findOne({name:name}, function(err, newfloatbox){
        if(err){
          console.log(err);
          //req.flash("error",err.name);
          res.send("error");
        } else {
    
          //list_of_floats = newfloatbox.floats;
          //list_of_floats.push(req.body.floatship.float);
          newfloatbox.float = req.body.floatship.float;
            floatbox.findOneAndUpdate({"name": newfloatbox.name},{$set: newfloatbox}, function(err, newfloat){
              if(err){
                console.log(err);
                //req.flash("error",err.name);
                res.send("error");
              } else {
                console.log("newfloat added", newfloat);
                //req.flash("success",'Query sent');
                res.redirect(307,'/float/'+newfloatbox.name+'/'+newfloatbox.password);
              }    
            });
        }
      });
  }
  else{
    console.log("session_error");
    res.send("session_error");
  }


  
};


/*
exports.float_add = function(req, res) {
  floatbox.findOne(req.body.floatship.name, function(err, newfloatbox){
    if(err){
      console.log(err);
      req.flash("error",err.name);
      res.send("error");
    } else {

      list_of_floats = newfloatbox.floats;
      list_of_floats.push(req.body.floatship.float);

      floatbox.findOneAndUpdate({"name": req.body.floatship.name},{$set: newfloatbox}, function(err, newfloat){
        if(err){
          console.log(err);
          req.flash("error",err.name);
          res.send("error");
        } else {
          console.log("newfloat added", newfloat);
          req.flash("success",'Query sent');
          res.redirect('/float/'+req.body.floatship.name+'/'+req.body.floatship.password);
        }

      });

    }
  });
};
*/

