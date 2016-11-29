var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.post('/MyPersons',function(request,response){
    	var id=request.query.userId;
    	console.log('Trying to get persons for user with id: '+id);
    	var mysql = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });
      connection.connect();
      var query='SELECT * from person where UserID='+id;
      connection.query(query, function(err, row, fields) {
        console.log("\nList of persons:");
        for(i in row){
        	console.log("Firstname: "+row[i].FirstName+"\n"+
        		        "LastName: "+row[i].LastName+"\n"+
        		        "Email: "+row[i].Email+"\n"+
        		        "Age: "+row[i].Age+"\n"+
        		        "Phone: "+row[i].Phone+"\n"+
        		        "Country: "+row[i].Country);
        	console.log("~~~~~~~~~~~~~~~~~~~~");
        }
        response.json(row);
      });
      connection.end();

});


app.post('/Login', function(request, response) {
      var username=request.query.username;
      var password=request.query.password;
      console.log('Trying to log user: '+username);
      var mysql = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='SELECT * from user where Username="'+username+'" and Password="'+password+'"';
      connection.query(query, function(err, row, fields) {
        console.log("Retrieving results...");
        if (!err){  
          if(row.length>0)
          {    
          	console.log("Login with success for user :"+row[0].Username);
              response.json({data:row});
          }else{
              console.log("User login failed !!");
              response.json({data:null});
          }
        }
        else{
        		console.log("MySql error ! No web server found !");
      		response.json({data:null});
        }
      });
      connection.end();
});


app.post('/Register', function(request, response) {
      var firstname=request.query.firstname;
      var lastname=request.query.lastname;
      var username=request.query.username;
      var password=request.query.password;
      console.log('Trying to register user: '+username);
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='INSERT INTO user(FirstName,LastName,Username,Password)'+
                          'VALUES("'+firstname+'","'+lastname+'","'+username+'","'+password+'")';
      connection.query(query, function(err, row, fields) {
        console.log("Retrieving results...");
        if (!err){  
              console.log("Register user with success...");
              response.json({valid:1});
        }
        else{
          console.log("Username already exist..");
          response.json({valid:0});
        }
      });
      connection.end();
});


app.post('/AddPerson', function(request, response) {
      var firstname=request.query.firstname;
      var lastname=request.query.lastname;
      var email=request.query.email;
      var age=request.query.age;
      var phone=request.query.phone;
      var country=request.query.country;
      var userid=request.query.userid;
      console.log('Trying to add person: '+email);
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='INSERT INTO person(FirstName,LastName,Email,Age,Phone,Country,UserID)'+
                          'VALUES("'+firstname+'","'+lastname+'","'+email+'",'+age+',"'+phone+'","'+country+'",'+userid+')';
      connection.query(query, function(err, row, fields) {
        console.log("Retrieving results...");
        if (!err){  
              console.log("Person added with success...");
              response.json({valid:1});
        }
        else{
          console.log("Person already exist..");
          response.json({valid:0});
        }
      });
      connection.end();
});

app.post('/DeletePerson', function(request, response) {
      var id=request.query.id;
      console.log('Trying to delete person with id : '+id);
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='DELETE FROM person WHERE PersonID='+id;
      connection.query(query, function(err, row, fields) {
        console.log("Retrieving results...");
        if (!err){  
              console.log("Person deleted with success...");
              response.json({valid:1});
        }
      });
      connection.end();
});


app.post('/SaveUser', function(request, response) {
    var firstname=request.query.firstname;
    var lastname=request.query.lastname;
    var id=request.query.id;
    console.log('Trying to save User Details');
    var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='UPDATE user set FirstName="'+firstname+'", LastName="'+lastname+'" where ID='+id;
      console.log(query);
      connection.query(query, function(err, row, fields) {
        if (!err){  
              console.log("User saved with success");
              response.json({valid:1});
        }
        else{
          console.log("Server error");
          response.json({valid:0});
        }
      });
      connection.end();
});
app.post('/SendEmail', function(request, response) {
      var email=request.query.email;
      var subject=request.query.subject;
      var body=request.query.body;
      console.log("Trying to send email to: "+email+
      			  "\nSubject: "+subject+
      			  "\nBody: "+body
      );
      var nodemailer = require('nodemailer');

      // create reusable transporter object using the default SMTP transport
      var transporter = nodemailer.createTransport({
      	service:'Gmail',
      	auth:{
      		user:'persons@gmail.com',
      		pass:'personpass'
      	}
      });
      console.log('\ntransporter created');
      transporter.sendMail({
      	from:'peoplecareteam@gmail.com',
      	to:email,
      	subject:subject,
      	text:body
      });
      console.log('\nemail send with success');
      response.json({valid:1});
});


app.post('/GetCountry', function(request, response) {
      var email=request.query.email;
      console.log("Trying to get country for person: "+email);
      var mysql      = require('mysql');
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'persons'
      });

      connection.connect();
      var query='SELECT Country FROM person WHERE Email="'+email+'"';
      console.log(query);
      connection.query(query, function(err, row, fields) {
        if (!err){  
              console.log("His country is: "+row[0].Country);
              response.json({country:row[0].Country});
        }
        else{
          console.log("Server error");
          response.json({valid:0});
        }
      });
      connection.end();
});

app.listen(3000,'192.168.43.237', function () {
  console.log('Android application listening on port 3000!');
});