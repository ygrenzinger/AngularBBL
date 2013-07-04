var application_root = __dirname,
  express = require("express"),
  path = require("path");
var databaseUrl = "bbl"; // "username:password@example.com/mydb"
var collections = ["projects", "types"]
var db = require("mongojs").connect(databaseUrl, collections);
var app = express();


// Config

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/title', function(req, res) {
  res.send('Projects crowfunding');
});

var serializeProject = function(project) {
  var str = '{ "title" : "' + project.title + '",';
  str = str + '"money" : ' + project.money + ',';
  str = str + '"date" : "' + project.date + '",';
  str = str + '"description" : "' + project.description + '"},' + '\n';
  return str;
}

app.get('/types', function(req, res) {
  db.types.find('', function(err, types) {
    if (err || !types) console.log("No types found");
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      var str = '[';
      var allTypes = [];
      types.forEach(function(type) {
        allTypes.push('"'+type.title+'"');
      });
      str = str + allTypes.join();
      str = str + ']';
      res.end(str);
    }
  });
});

app.get('/projects', function(req, res) {
  db.projects.find('', function(err, projects) {
    if (err || !projects) console.log("No projects found");
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      var str = '[';
      var allProjects = [];
      projects.forEach(function(project) {
        allProjects.push(JSON.stringify(project));
      });
      str = str + allProjects.join();
      str = str + ']';
      res.end(str);
    }
  });
});

app.get('/projects/titles', function(req, res) {
  db.projects.find('', function(err, projects) {
    if (err || !projects) console.log("No projects found");
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      var str = '[';
      var allTitles = [];
      projects.forEach(function(project) {
        allTitles.push('"'+project.title+'"');
      });
      str = str + allTitles.join();
      str = str + ']';
      res.end(str);
    }
  });
});

app.get('/project/:title', function(req, res) {
  var mongoQuery = { title: req.params.title};
  db.projects.find(mongoQuery, function(err, project) {
    console.log(project[0]);
    res.end(JSON.stringify(project[0]));
  });
});

app.delete('/angularjsscenario/delete', function(req, res) {
  var mongoQuery = { title: 'AngularJSScenario'};
  db.projects.remove(mongoQuery, function(err, project) {
    console.log("Delete: " + project[0]);
  });
});

var errorResponse = function(res, errorMessage) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end(errorMessage);
};

app.post('/project', function(req, res) {
  console.log("POST: " + req.body);
  var project = req.body;
  console.log(project);
  if (!project.title || project.title === "") {
    errorResponse(res, "Project title is incorrect or empty");
    return;
  }
  if (!project.money || project.money < 0) {
    errorResponse(res, "Funding needs are incorrect or too low");
    return;
  }
  if (!project.date || project.date == "" || new Date(project.date) <= new Date()) {
    errorResponse(res, "Funding limit date is incorrect or not in the future");
    return;
  }

  db.projects.insert({
    title: project.title,
    type: project.type,
    money: project.money,
    date: new Date(project.date),
    description: project.description,
  }, {continueOnError: false, safe: true}, function(err, saved) {
    if (err) errorResponse(res, "Project not saved with error " + err);
    else res.end("Project saved");
  });
});

app.listen(1212);