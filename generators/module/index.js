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
      }
    ];

    var done = this.async();
    this.prompt(prompts, function(answers) {
      this.props = answers
      this.log(answers);
      done();
    }.bind(this));
  },

  writing: function () {

    var thisRef = this;
    var userInputs = thisRef.props;
    var type = userInputs.type;
    var name = userInputs.name;
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
         type: type
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
    this.installDependencies();
  }
});
