var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'bradford.reinger46@ethereal.email',
      pass: 'qdRNpN9ags8CE2wCM8'
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//check session before processing any other routes:
router.use(function(req,res, next) {
  if('user' in req.session) {
    next();
  } else {
    res.sendStatus(401);
  }
});

// Get account settings to populate form data in settings page
router.get('/accountSettings', function(req, res, next) {
  if('user' in req.session) {
    req.pool.getConnection(function(err, connection) {
      if ( err ) {
        res.sendStatus(500);
        return;
      }
      let query = `SELECT firstName, lastName, email, available.weekDays FROM users INNER JOIN available ON users.userID = available.userID WHERE email = "${req.session.user}";`;
      connection.query(query, function(err, rows, fields) {
        connection.release();
        if ( err ) {
          res.sendStatus(500);
          return;
        }
        console.log(rows);
        res.json(rows);
      })
    })
    // next();
  } else {
    res.sendStatus(401);
  }
})

// Changes profile settings
router.post('/changeProfileSettings', function(req, res, next) {
  let email = req.body.email;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  if ( email.length < 5 || firstName.length < 2 || lastName.length < 2 ) {
    res.status(500).end();
    return;
  }

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE email = "${req.session.user}";`;
    connection.query(query, [req.body.firstName, req.body.lastName, req.body.email], function(err, rows, fiels) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      req.session.user = email;
      res.sendStatus(200);
      return;
    })
  })
})

// Change availability
router.post('/setAvailability', function(req, res, next) {
  let availability = JSON.stringify(req.body.availability);

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE available INNER JOIN users ON available.userID = users.userID SET available.weekDays = ? WHERE email = "${req.session.user}";`;
    connection.query(query, [availability], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
      return;
    })
  })
})

// Changes password settings
router.post('/changePasswordSettings', function(req, res, next) {
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let passwordCheck;

  // Check to see if password requirements are met
    if ( oldPassword.length < 5 || newPassword[0].length < 5 || newPassword[0] != newPassword[1] ) {
      res.status(500).end();
      return;
    }

  // Access database to see if old password is correct
  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = `SELECT IF(SHA2(?, 224) = users.password, 'true', 'false') AS results FROM users WHERE email = "${req.session.user}";`;
    connection.query(query, [oldPassword], function(err, rows, fields) {
      connection.release();

      if ( err ) {
        res.status(500).end();
        return;
      }

      console.log(rows[0].results);
      passwordCheck = rows[0].results
      // If false, send error and end connection
      if ( rows[0].results == 'true' ) {
        req.pool.getConnection(function(err, connection) {
          if ( err ) {
            res.sendStatus(500);
            return;
          }

          let query = `UPDATE users SET password = SHA2(?,224) WHERE email = "${req.session.user}";`;
          connection.query(query, [newPassword[0]], function(err, rows, fiels) {
            connection.release();

            if ( err ) {
              res.sendStatus(500);
              return;
            }

            console.log(rows);
            res.sendStatus(200);
            return;
          })
        })
      } else {
        console.log("incorrect password");
        res.status(500).end();
        return;
      }
    })
  })
  console.log("runs after password check");
  console.log(passwordCheck);

  // req.pool.getConnection(function(err, connection) {
  //   if ( err ) {
  //     res.sendStatus(500);
  //     return;
  //   }

  //   let query = `UPDATE users SET password = SHA2(?,224) WHERE email = "${req.session.user}";`;
  //   connection.query(query, [newPassword[0]], function(err, rows, fiels) {
  //     connection.release();

  //     if ( err ) {
  //       res.sendStatus(500);
  //       return;
  //     }

  //     console.log(rows);
  //     res.sendStatus(200);
  //     return;
  //   })
  // })
})

// // send signed home
// router.get('/signedHome', function(req, res, next) {
//   res.sendFile("../public/tempSignedHome.html");
// });

// get user ID (used in create event)
router.get('/userID', function(req, res, next) {
  req.pool.getConnection(function(error, connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
      let query = `SELECT userID FROM users WHERE email = "${req.session.user}"`;
      connection.query(query, [req.session.user], function(err,rows,fields) {
        connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }
        if(rows.length > 0){
          console.log('success');
          res.json(rows);
        } else {
          console.log('bad session')
          res.sendStatus(401);
        }
      });
    });
});

router.post('/getEvents', function(req, res, next) {
  let userID = req.body.userID;

  if('userID' in req.body) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }

      let query = 'SELECT events.eventName, events.eventStartTime, events.eventEndTime, events.eventLocation FROM events WHERE eventOwner = ?;';
      connection.query(query, [userID, userID], function(err,rows,fields) {
        connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }
        if ( !rows ) {
          console.log(rows);
          res.sendStatus(500);
          return;
        }
        if(rows.length > 0){
          console.log('success');
          res.json(rows);
        } else {
          console.log('No events')
          res.sendStatus(401);
        }
      });
    });
  }
});


// get user ID (used in create event)
// router.get('/userID', function(req, res, next) {
//   req.pool.getConnection(function(error, connection){
//     if(error){
//       console.log(error);
//       res.sendStatus(500);
//       return;
//     }
//       let query = `SELECT userID FROM users WHERE email = "${req.session.user}"`;
//       connection.query(query, [req.session.user], function(err,rows,fields) {
//         connection.release(); // release connection
//         if(error){
//           console.log(error);
//           res.sendStatus(500);
//           return;
//         }
//         if(rows.length > 0){
//           console.log('success');
//           res.json(rows);
//         } else {
//           console.log('bad session')
//           res.sendStatus(401);
//         }
//       });
//     });
// });

//create the original event with event name and event owner to allow invites and further information
router.post('/createEvent', function(req, res, next){
  console.log(req.body);
  if('eventName' in req.body && 'eventOwner' in req.body){
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log("error conecting to database")
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log("Before query");
      let query = "INSERT INTO events (eventName, eventOwner) VALUES (?,?)";
      connection.query(query, [req.body.eventName, req.body.eventOwner], function(err, rows, fields) {
      connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        } else {
          console.log('event created');
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//routes for inviting users
//get invited users id
router.get('/getInvitedUser', function(req, res, next) {
  let email = req.query.email;
  console.log(email);

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }
    let query = 'SELECT userID FROM users WHERE email = ?';

    connection.query(query, [email], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
      return;
    })
  })
})
//get eventID for attendance
router.get('/getEventID', function(req, res, next) {
  req.pool.getConnection(function(error, connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
      let query = "SELECT eventID FROM events WHERE eventID=(SELECT max(eventID) FROM events)"; //highest eventID will be most recent event created, not the best mehtod
      connection.query(query, function(err,rows,fields) { //NOT SURE IF THIS LINE IS CORRECT!!!!!
        connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        }
        if(rows.length > 0){
          console.log('success');
          res.json(rows);
        } else {
          console.log('bad session')
          res.sendStatus(401);
        }
      });
    });
});


//add invited user to the database
function sendInvite(email, linkKey) {
  let sendText = `Dear invitee, you have been invited to a Gather event! Please click the following link to set your availability: http://127.0.0.1:3000/attend?key=${linkKey}`
  let info = transporter.sendMail({
    from: 'bradford.reinger46@ethereal.email',
    to: email,
    subject: 'Invitation to Gather!',
    text: sendText,
    html: "<p>"+sendText+"</p>",
  });
}

// Invite people who are not users to event
router.post('/invite', function(req, res, next) {
  // Set linkKey to a large random number to avoid collision. This will become the "userID" of the invitee who does not have an account
  let linkKey = Math.floor(Math.random() * 9999999);
  let email = req.body.email;
  let eventID = req.body.eventID;
  console.log(req.body);
  if ( eventID && email ) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log("error conecting to database")
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log("Before query");
      let query = "INSERT INTO invited VALUES (?, ?, ?)"; //UNSURE ABOUT THIS! USER ID WHERE EVENT ID OR INSERT BOTH??
      connection.query(query, [linkKey, eventID, email], function(err, rows, fields) {
      connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        } else {
          console.log('User invited', rows);
          sendInvite(email, linkKey);
          res.sendStatus(200);
          return;
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/setTime', function(req, res, next){
  console.log(req.body);
  if('eventStartTime' in req.body && 'eventEndTime' in req.body && 'eventID' in req.body){
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log("error conecting to database")
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log("Before query");
      let query = "UPDATE events SET eventStartTime = ?, eventEndTime = ? WHERE eventID = ?";
      connection.query(query, [req.body.eventStartTime, req.body.eventEndTime, req.body.eventID], function(err, rows, fields) {
      connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        } else {
          console.log('Event time set');
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/setLocation', function(req, res, next){
  console.log("here")
  if('eventLocation' in req.body && 'eventID' in req.body){
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log("error conecting to database")
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log("Before query");
      let query = "UPDATE events SET eventLocation = ? WHERE eventID = ?";
      connection.query(query, [req.body.eventLocation, req.body.eventID], function(err, rows, fields) {
      connection.release(); // release connection
        if(error){
          console.log(error);
          res.sendStatus(500);
          return;
        } else {
          console.log('Event location set');
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Allow user to delete account
router.post('/deleteAccount', function(req, res, next) {
  let pass = req.query.password;

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }
    let query = `SELECT IF(SHA2(?, 224) = users.password, 'true', 'false') AS results FROM users WHERE email = "${req.session.user}";`;
    connection.query(query, [pass], function(err, rows, fields) {
      if ( err ) {
        connection.release();
        res.sendStatus(500);
        return;
      }
      if ( rows[0].results == 'true') {
        let query = `DELETE FROM users WHERE email = "${req.session.user}";`;
        connection.query(query, function(err, rows, fields) {
          connection.release();
          if ( err ) {
            res.sendStatus(500);
            return;
          }
          // Remove user from session
          if ( 'user' in req.session ) {
            delete req.session.user;
          }
          res.sendStatus(200);
          return;
        })
      } else {
        connection.release();
        res.sendStatus(401);
        return;
      }
    })
  })
});

// –––––––––––––––––––––––––––––– ADMIN FROM HERE ––––––––––––––––––––––––––––––

//check session before processing any other routes:
router.use(function(req,res, next) {
  if('user' in req.session) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }
      let query = `SELECT users.firstName, users.lastName FROM users INNER JOIN admins ON users.userID = admins.userID WHERE users.email = "${req.session.user}"`;
      connection.query(query, [req.session.user], function(err,rows,fields) {
          connection.release(); // release connection
          if(error){
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0){
            console.log('admin auth success');
            next();
          } else {
            console.log('not admin')
            res.sendStatus(401);
          }
        });
      });
  } else {
    res.sendStatus(401);
  }
});


router.get('/adminCheck', function(req, res, next) {
  res.sendStatus(200);
});

// Sending admin panel to users who are an admin
router.use('/admin', function(req, res, next) {
  return res.sendFile('admin.html', { root: 'private'});
})

router.get('/getUsers', function(req, res, next) {
  let user = req.query.user;
  console.log(user);

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }
    let query = 'SELECT * FROM users WHERE firstName = ?'

    if ( req.query.all ) {
      query = 'SELECT * FROM users';
    }

    connection.query(query, [user], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
      return;
    })
  })
})

// Delete a user by admin
router.post('/adminDeleteUser', function(req, res, next) {
  let email = req.query.email;
  // Return if email is empty
  if ( !email ) {
    res.sendStatus(500);
    return;
  }
  // Return if attempting to delete current user
  if ( email == req.session.user ) {
    res.sendStatus(500);
    return;
  }

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM users WHERE email = ?";
    connection.query(query, [email], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    })
  })
})

// Change a user's name by admin
router.post('/adminChangeName', function(req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE users SET firstName = ?, lastName = ? WHERE email = ?";
    connection.query(query, [firstName, lastName, email], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
      return;
    })
  })
})

// Make a new admin
router.post('/makeAdmin', function(req, res, next) {
  let id = req.query.id;

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = "INSERT INTO admins VALUES (?)"
    connection.query(query, [id], function(err, rows, fields) {
      if ( err ) {
        res.sendStatus(501);
        return;
      }

      res.sendStatus(200);
      return;
    })
  })
})

// Get events for admin
router.get('/getEvents', function(req, res, next) {
  let event = req.query.event;
  console.log(event);

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }
    let query = 'SELECT * FROM events WHERE eventName = ?'

    if ( req.query.all ) {
      query = 'SELECT * FROM events';
    }

    connection.query(query, [event], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }
      console.log(query, rows);
      res.json(rows);
      return;
    })
  })
})

// Change event by admin
router.post('/adminChangeEvent', function(req, res, next) {
  let event = {
    eventID: req.body.eventID,
    eventName: req.body.eventName,
    eventOwner: req.body.eventOwner,
    eventStartTime: req.body.eventStartTime,
    eventEndTime: req.body.eventEndTime
  }
  console.log(event);


  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE events SET eventName = ?, eventOwner = ?, eventStartTime = ?, eventEndTime = ? WHERE eventID = ?";
    connection.query(query, [event.eventName, event.eventOwner, event.eventStartTime, event.eventEndTime, event.eventID], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
      return;
    })
  })
})

// Delete event by admin
router.post('/adminDeleteEvent', function(req, res, next) {
  let id = req.query.id;

  // Return if id is empty
  if ( !id ) {
    res.sendStatus(500);
    return;
  }

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM events WHERE eventID = ?";
    connection.query(query, [id], function(err, rows, fields) {
      connection.release();
      if ( err ) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    })
  })
})

module.exports = router;
