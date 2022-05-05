const {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} = require("./middleware/validations/userValidation");
const fs = require("fs");
const express = require("express");

var createError = require("http-errors");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//empty object for inserting in users.json file
var addUserData = {
  completeUserData: [],
};

app.get("/", (req, res) => {
  res.send("Hello");
});

//register route
app.post(
  "/api/user/signup",
  [validateName, validatePhone, validateEmail, validatePassword],
  (req, res) => {
    const parsedData = req.body;
    try {
      fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        } else {
          addUserData = JSON.parse(data);
          addUserData.completeUserData.push(parsedData);
          saveDataToFile = JSON.stringify(addUserData);

          //writing data received from POST request in to the file
          fs.writeFile("users.json", saveDataToFile, "utf-8", function (err) {
            if (err) throw err;
            //sending response back
            res.send("Registered Successfully...");
          });
          // res.send('done')
        }
      });
    } catch (error) {
      res.status(400);
      res.send("Something went wrong...!");
    }
  }
);

//login route
app.post("/api/user/login", [validateEmail], (req, res) => {
  var userLoginDetail = req.body;
  // res.send(userLoginDetail)
  try {
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) throw err;
      else {
        const readData = JSON.parse(data);
        var validLogin = false;
        for (var key in readData.completeUserData) {
          var obj = readData.completeUserData[key];

          if (
            obj.email === userLoginDetail.email &&
            obj.password === userLoginDetail.password
          ) {
            validLogin = true;
          }
        }
        if (validLogin) {
          res.send("Login Success....");
        } else {
          res.status(400);
          res.send("Login failed....");
        }
      }
    });
  } catch (error) {
    res.status(400);
    res.send("Something went wrong...!");
  }
});

//update route
app.patch(
  "/api/user/:email",
  [validateName, validatePhone, validateEmail],
  (req, res) => {
    var api_email = req.params.email;
    if (
      /^[a-z]+(?!.*(?:\_{2,}|\.{2,}))(?:[\.+\_]{0,1}[a-z])*@[a-zA-Z]+\.[a-zA-Z]+$/g.test(
        api_email
      ) === false
    ) {
      res.status(400);
      res.send("Email is not valid");
    } else {
      updatedUserData = req.body;
      fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
          res.send(err);
        } else {
          var oldData = JSON.parse(data);
          var updatedOrNot = false;
          for (var key in oldData.completeUserData) {
            if (oldData.completeUserData[key]["email"] === api_email) {
              oldData.completeUserData[key]["name"] = updatedUserData["name"];
              oldData.completeUserData[key]["phone"] = updatedUserData["phone"];
              oldData.completeUserData[key]["email"] = updatedUserData["email"];
              // oldData.completeUserData[key] = updatedUserData;
              updatedOrNot = true;
            }
          }
          if (updatedOrNot === false) {
            res.status(404);
            res.send("User not found");
          }
          var addUpdatedData = JSON.stringify(oldData);

          fs.writeFile("users.json", addUpdatedData, "utf-8", function (err) {
            if (err) throw err;
            //sending response back
            res.send("Updated success");
          });
        }
      });
    }
  }
);

//delete route
app.delete("/api/user/:email", (req, res) => {
  var api_delete_email = req.params.email;
  try {
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) {
        res.send(err);
      } else {
        var oldData = JSON.parse(data);
        var userDeletedOrNot = false;
        for (var key in oldData.completeUserData) {
          if (oldData.completeUserData[key]["email"] === api_delete_email) {
            oldData.completeUserData.splice(key, 1);
            userDeletedOrNot = true;
          }
        }
        if (userDeletedOrNot === false) {
          res.status(404);
          res.send("User not found");
        }
        var addUpdatedData = JSON.stringify(oldData);

        fs.writeFile("users.json", addUpdatedData, "utf-8", function (err) {
          if (err) throw err;
          //sending response back
          res.send("User deleted success");
        });
      }
    });
  } catch (error) {
    res.status(400);
    res.send("Something went wrong...!");
  }
});

//server port
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...!`);
});
