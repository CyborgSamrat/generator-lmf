'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cat\'s pajamas ' + chalk.red('generator-lmf') + ' generator!'
    ));
    var roles;
    var thisRef = this;
    var nodefs = require('fs');
    var content = nodefs.readFileSync('back-end/configs/roles.json');
    roles = JSON.parse(content);
    roles = roles.roles;

    var prompts = [
      {
      type: 'list',
      name: 'type',
      message: 'What type of module you wanna generate?',
      choices:['business', 'infrastructure', 'public'],
      default: 0
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the module',
        default: "sample"
      },{
        type: 'checkbox',
        name: 'modify',
        message: "Enter permission information, who can modify(create, edit, delete) data?",
        choices: roles
      },
      {
        type: 'checkbox',
        name: 'read',
        message: "Enter permission information, who can read/view data?",
        choices: roles
      }
    ];
    var done = thisRef.async();
    thisRef.prompt(prompts, function(answers) {
      thisRef.props = answers
      thisRef.log(answers);
      done();
    }.bind(thisRef));
  },

  writing: function () {

    var thisRef = this;
    var userInputs = thisRef.props;
    var type = userInputs.type;
    var name = userInputs.name;
    var permissions = {
      modify: userInputs.modify,
      read: userInputs.read
    }
var nodefs = require('fs');
    permissions.modify.forEach(function (role) {
      nodefs.readFile('front-end/mocks/template-config.' + role + '.json',function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);

        var newMod =  {
          "title": name.charAt(0).toUpperCase() + name.slice(1),
          "menus": [
            {
              "title": "All " + name + "s",
              "state": "all-" + name + "s",
              "icon":"glyphicon glyphicon-list-alt"
            },
            {
              "title": "Create " + name,
              "state": "create-" + name,
              "icon":"glyphicon glyphicon-plus-sign"
            }
          ]
        }
        parseJson.leftNavbar.push(newMod);
        nodefs.writeFile('front-end/mocks/template-config.'+ role +'.json',JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
      })
    })

    //backend
    var nodefs = require('fs');
    var dir = 'back-end/configs/models';
    if (!nodefs.existsSync(dir)){
      nodefs.mkdirSync(dir);
    }
    nodefs.writeFile('back-end/configs/models/' + name +'.json',JSON.stringify(permissions),function(err){
      if(err) throw err;
    });
    thisRef.fs.copyTpl(
      thisRef.templatePath('module/models/model.js' ),
      thisRef.destinationPath('back-end/models/' + name.charAt(0).toLowerCase() + name.slice(1) + '.js'),
      {
        model:name
      }
    );
    nodefs.readFile('back-end/models/index.js', 'utf-8', function(err, data){
      if (err) throw err;

      var newValue = data.replace('}', ',' + name + ':require("./' + name + '")}');

      nodefs.writeFile('back-end/models/index.js', newValue, 'utf-8', function (err) {
        if (err) throw err;
      });
    });


    //frontend
    var module = {
      controllers: ["all-modules.controller.js", "create-module.controller.js",
        "delete-module-confirmation.controller.js", "edit-module-modal.controller.js",
        "view-module-modal.controller.js" ],
      styles: ["module.css"],
      views: ["all-modules.view.html", "create-module.view.html",
        "delete-module-confirmation-modal.view.html", "edit-module-modal.view.html",
        "view-module-modal.view.html"],
      base:["module.config.js", "module.dev.json"],
      services: ["module.service.js"]
    };

    for(var key in module){
     module[key].forEach(function(item){
     thisRef.fs.copyTpl(
     thisRef.templatePath('module/'+ (key=="base"?"":key) + "/" + item ),
     thisRef.destinationPath('front-end/apps/'+ type + "/" + name + "/" + (key=="base"?"":key) + "/" + item.replace("module", name)),
       {
         uname: name.charAt(0).toUpperCase() + name.slice(1),
         lname:name.charAt(0).toLowerCase() + name.slice(1),
         type: type,
         canModify: JSON.stringify(permissions.modify),
         canRead: JSON.stringify(permissions.read)
       }
     );
     });
     }

    //add in initial modules
    var nodefs = require('fs');

    nodefs.readFile('front-end/mocks/initial-modules.json',function(err,content){
      if(err) throw err;
      var parseJson = JSON.parse(content);
      var newMod = {
        name: name,
        type: type
      }
      parseJson.modules.push(newMod);
      nodefs.writeFile('front-end/mocks/initial-modules.json',JSON.stringify(parseJson),function(err){
        if(err) throw err;
      })
    });
    nodefs.readFile('front-end/mocks/template-config.admin.json',function(err,content){
      if(err) throw err;
      var parseJson = JSON.parse(content);

      var newMod =  {
        "title": name.charAt(0).toUpperCase() + name.slice(1),
        "menus": [
          {
            "title": "All " + name + "s",
            "state": "all-" + name + "s",
            "icon":"glyphicon glyphicon-list-alt"
          },
          {
            "title": "Create " + name,
            "state": "create-" + name,
            "icon":"glyphicon glyphicon-plus-sign"
          }
        ]
      }
      parseJson.leftNavbar.push(newMod);
      nodefs.writeFile('front-end/mocks/template-config.admin.json',JSON.stringify(parseJson),function(err){
        if(err) throw err;
      })
    })
  },

  install: function () {
  }
});
