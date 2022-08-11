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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  if ('email' in req.body && 'password' in req.body) {

    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }

        let query = "SELECT userID,firstName,lastName,email,password FROM users WHERE email = ? AND password = SHA2(?, 224)";
        connection.query(query, [req.body.email,req.body.password], function(err,rows,fields) {
          connection.release(); // release connection
          if(error){
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0){
            console.log('success');
            req.session.user = req.body.email;
            // res.send(req.session.user);
            res.sendStatus(200);
          } else {
            console.log('bad login')
            res.sendStatus(401);
          }
        });
      });
    //});
  }
});

router.get('/loggedin', function(req, res, next) {
  if ('user' in req.session) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }
        let query = `SELECT firstName,lastName FROM users WHERE email = "${req.session.user}"`;
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
            // res.send(req.session.user);
          } else {
            console.log('bad session')
            res.sendStatus(401);
          }
        });
      });
  } else {
    res.sendStatus(401);
  }
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  if('firstName' in req.body && 'lastName' in req.body && 'email' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log("here");
        console.log(error);
        res.sendStatus(500);
        return;
      }
        let query = "INSERT INTO users (firstName,lastName,email,password) VALUES (?,?,?,SHA2(?,224));";
        connection.query(query, [req.body.firstName,req.body.lastName,req.body.email,req.body.password], function(err,rows,fields) {
          if(error){
            console.log(error);
            res.sendStatus(403);
            return;
          }
          // Create availability entry
          let query = `INSERT INTO available VALUES ((SELECT userID FROM users WHERE email = "${req.body.email}"), '[false,false,false,false,false,false,false]', null);`;
          connection.query(query, function(err, rows, fields) {
            if ( err ) {
              console.log(err);
              connection.release();
              res.sendStatus(500);
              return;
            }
            let query = "SELECT userID,firstName,lastName,email,password FROM users WHERE email = ? AND password = SHA2(?,224)";
            connection.query(query, [req.body.email,req.body.password], function(err,rows,fields) {
              connection.release(); // release connection
              if(error){
                console.log(error);
                res.sendStatus(500);
                return;
              }
              if(rows.length > 0){
                console.log('success');
                res.sendStatus(200);
              } else {
                console.log('bad login')
                res.sendStatus(401);
              }
          });

        });
      });
    });

  } else {
    console.log('bad request');
    res.sendStatus(400);
  }
});

router.post('/emailCheck', function(req, res, next) {
  if ('email' in req.body) {
    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }
        let query = "SELECT userID,firstName,lastName,email,password FROM users WHERE email = ?";
        connection.query(query, [req.body.email], function(err,rows,fields) {
          connection.release(); // release connection
          if(error){
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0){
            console.log('account exists');
            res.sendStatus(409);
          } else {
            console.log('account does not exist')
            res.sendStatus(200);
          }
        });
      });
  }
});

router.get('/logout', function(req, res, next) {
  console.log("logout");
  if('user' in req.session){
    delete req.session.user
  }
  res.redirect('/');
});

router.post('/logout', function(req, res, next) {
  console.log("logout");
  if('user' in req.session){
    delete req.session.user
  }
  res.end();
});

//google sign in
const CLIENT_ID = '480299986564-8qblnt62cqli9vrl8lkb3o37bedgomed.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

router.post('/tokensignin', async function(req, res, next) {
  console.log("before try");
  try {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    console.log("after try");
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const email = payload['email'];
    console.log("after get payload");
    console.log(userid+" "+email);

    // Do login stuff here
    // e.g. var query = 'SELECT * FROM user WHERE email = ?';

    req.pool.getConnection(function(error, connection){
      if(error){
        console.log(error);
        res.sendStatus(500);
        return;
      }
        console.log(email)
        let query = `SELECT userID,firstName,lastName,email,password FROM users WHERE email = "${email}"`;
        connection.query(query, [email], function(err,rows,fields) {
          connection.release(); // release connection
          if(error){
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0){
            console.log('success');
            req.session.user = email;
            // res.send(req.session.user);
            res.sendStatus(200);
          } else {
            console.log('bad login')
            res.sendStatus(401);
          }
        });
      });

    // res.send();
  } catch {
      res.sendStatus(401);
  }
});

// router.get('/adminCheck', function(req, res, next) {
//   if ('user' in req.session) {
//     req.pool.getConnection(function(error, connection){
//       if(error){
//         console.log(error);
//         res.sendStatus(500);
//         return;
//       }
//         // let query = `SELECT firstName,lastName FROM users WHERE email = "${req.session.user}"`;
//         let query = `SELECT users.firstName, users.lastName FROM users INNER JOIN admins ON users.userID = admins.userID WHERE users.email = "${req.session.user}"`;
//         connection.query(query, [req.session.user], function(err,rows,fields) {
//           connection.release(); // release connection
//           if(error){
//             console.log(error);
//             res.sendStatus(500);
//             return;
//           }
//           if(rows.length > 0){
//             console.log('success');
//             res.sendStatus(200);
//           } else {
//             console.log('bad session')
//             res.sendStatus(401);
//           }
//         });
//       });
//   } else {
//     res.sendStatus(401);
//   }
// });


// Change availability for invitee's
router.post('/setAvailability', function(req, res, next) {
  let availability = JSON.stringify(req.body.availability);
  let linkKey = req.body.key;

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO available VALUES (null, ?, ?)`;
    connection.query(query, [availability, linkKey], function(err, rows, fields) {
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
});

// Set attending for invitee
router.post('/setAttending', function(req, res, next) {
  let linkKey = req.query.linkKey;

  req.pool.getConnection(function(err, connection) {
    if ( err ) {
      res.sendStatus(500);
      return;
    }
    let query = "SELECT * FROM invited WHERE linkKey = ?";
    connection.query(query, [linkKey], function(err, rows, fields) {
      if ( err ) {
        connection.release();
        res.sendStatus(500);
        return;
      }
      console.log(rows[0]);
      eventID = rows[0].eventID;
      email = rows[0].email;

      let query = `INSERT INTO attending VALUES (?, null, ?)`;
      connection.query(query, [eventID, linkKey], function(err, rows, fields) {
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
});

// Route for sending invitee to setting availability
router.get('/attend', function(req, res, next) {
  return res.sendFile('invitation.html', { root: 'private'});
});

module.exports = router;