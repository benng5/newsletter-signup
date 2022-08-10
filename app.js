const express = require("express");
const app = express();
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
//Serving static files (images, CSS, and JavaScript)
app.use(express.static("public"));


app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listID = "9ef483510d";

  //Data object with all info
  var data = {
    //Follows mailchimp data format
    members: [
      {
        email_address: email,
        status: "subscribed",
        //Object type
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  //Converting the data into a string in JSON format
  var jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/<Your ID>";

  //Options for HTTPS request
  const options = {
    method: "POST",
    auth: "benNguyen:<Your API>-us13"
  }

  /** 
   * POST data to external resource 
   * @param response: the response(data) sent back from external resource
   */
  const request = https.request(url, options, function(response) {

    if(response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    console.log(response.statusCode);

    //Printing the data to the console
    // response.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // });
  });

  //Sending data to external resource
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

/**
 * Dynamic port that deploy website will define on the go
 * process is an object defined by deploy website
 */
app.listen(process.env.PORT || port, function() {
  console.log("Server is running on " + port + " or " + process.env.PORT);
});
