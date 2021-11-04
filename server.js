// zmienne, stałe
var path = require("path");
const bodyParser = require("body-parser");
var express = require("express");
var app = express();
const PORT = 3000;

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
  { nick: "111", email: "111@w.pl" },
  { nick: "222", email: "222@w.pl" },
  { nick: "333", email: "333@w.pl" },
];

app.get("/", function (req, res) {
  if (req.query.email != undefined) {
    if (Array.isArray(req.query.email)) {
      for (const val of req.query.email) {
        users = users.filter(function (obj) {
          return obj.email !== val;
        });
      }
    } else {
      users = users.filter(function (obj) {
        return obj.email !== req.query.email;
      });
    }
  }
  res.sendFile(path.join(__dirname + "/static/addUser.html"));
});

app.post("/handleForm", function (req, res) {
  let email = req.body.email;
  let emailExists = false;

  for (const [key, value] of Object.entries(users)) {
    if (value.email == email) emailExists = true;
  }

  if (emailExists) res.send("taki mail już jest w bazie");
  else {
    let newUser = {
      nick: req.body.nick,
      email: email,
    };
    users.push(newUser);
    res.send("dodano email");
  }
});

app.get("/:site", function (req, res) {
  let site = req.params.site;
  switch (site) {
    case "removeUserByCheckbox":
      let end = "";
      for (const [key, value] of Object.entries(users)) {
        end += `</br><input type="checkbox" name="email" value="${value.email}"><label">${value.email}</label>`;
      }
      res.send(
        `<form action="../" method="get">${end}</br></br><input type="submit" value="Usuń"></form>`
      );
      break;
    case "removeUserByRadio":
      let end2 = "";
      for (const [key, value] of Object.entries(users)) {
        end2 += `</br><input type="radio" name="email" value="${value.email}"><label">${value.email}</label>`;
      }
      res.send(
        `<form action="../" method="get">${end2}</br></br><input type="submit" value="Usuń"></form>`
      );
      break;
    case "removeUserBySelect":
      let end3 = `<select name="email">`;
      for (const [key, value] of Object.entries(users)) {
        end3 += `</br><option value="${value.email}">${value.email}</option>`;
      }
      end3 += "</select>";
      res.send(
        `<form action="../" method="get">${end3}</br></br><input type="submit" value="Usuń"></form>`
      );
      break;
  }
});

// nasłuch na określonym porcie
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
