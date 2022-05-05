function validateName(req, res, next) {
  console.log("signup middleware called..!");

  var api_name = req.body.name;
  // console.log(/^[a-zA-Z]+$/.test(api_name))
  if (/^[a-zA-Z\s]*$/.test(api_name) === false) {
    res.status(500);
    res.send("Name must contain only alphabetics characters [A-Z | a-z]");
  } else if (
    (req.body.name.length >= 2 && req.body.name.length <= 30) === false
  ) {
    res.status(500);
    res.send("name length between 2 and 30");
  } else {
    next();
  }
}

function validatePhone(req, res, next) {
  var api_phone = req.body.phone;
  if (/^[0-9]+$/.test(api_phone) === false) {
    res.status(500);
    res.send("Phone number must contain digits only");
  } else if ((req.body.phone.length === 10) === false) {
    res.status(500);
    res.send("Phone number must be of 10 length");
  } else {
    next();
  }
}

function validatePassword(req, res, next) {
  var api_password = req.body.password;
  console.log(
    /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,16}$/.test(api_password)
  );
    if(/^(?=.{8,16})(?=.*[0-9])(?=.*[!*@#$%^&+=]).*$/.test(api_password)===false){
      res.status(500)
      res.send("password is not valid")
    }else{
      next()
    }
}

function validateEmail(req, res, next) {
  var api_email = req.body.email;
  console.log(/\d/.test(api_email));

    if(/^[a-z]+(?!.*(?:\_{2,}|\.{2,}))(?:[\.+\_]{0,1}[a-z])*@[a-zA-Z]+\.[a-zA-Z]+$/g.test(api_email)===false){
        res.status(500)
        res.send("Email is not valid")
    }
    else{
        next()
    }

//   if (/^\S+@\S+\.\S+$/.test(api_email) === false) {
//     res.status(500);
//     res.send("Email not valid");
//   } else if (/\d/.test(api_email)) {
//     res.status(500);
//     res.send("Numbers not allowed in email");
//   } else {
//     next();
//   }
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
};
