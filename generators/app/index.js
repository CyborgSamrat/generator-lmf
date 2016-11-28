'use strict';
//Require dependencies
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


module.exports = yeoman.Base.extend({
//Configurations will be loaded here.
  prompting: function() {
    var done = this.async();
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is your project name?',
        //Defaults to the project's folder name if the input is skipped
        default: this.appname
      },
      {
        type: 'input',
        name: 'roles',
        message: 'Enter roles separated by comma',
        default: "admin"
      }
    ]
    this.prompt(prompts, function(answers) {
      this.props = answers;
      done();
    }.bind(this));
  },
  writing: {
    config: function () {
      var roles = this.props.roles;
      roles = roles.split(',');
      var rolesJSON = {
        roles: roles
      };

      var nodefs = require('fs');
      this.fs.copyTpl(
        this.templatePath('back-end/package.json'),
        this.destinationPath('back-end/package.json'), {
          name: this.props.name
        }
      );
      this.fs.copyTpl(
        this.templatePath('front-end/bower.json'),
        this.destinationPath('bower.json'), {
          name: this.props.name
        }
      );
      this.fs.copyTpl(
        this.templatePath('.bowerrc'),
        this.destinationPath('.bowerrc')
      );
      var dir = 'back-end';
      if (!nodefs.existsSync(dir)){
        nodefs.mkdirSync(dir);
      }
      dir = 'back-end/configs';
      if (!nodefs.existsSync(dir)){
        nodefs.mkdirSync(dir);
      }
      nodefs.writeFile('back-end/configs/roles.json',JSON.stringify(rolesJSON),function(err){
        if(err) throw err;
      });
      dir = 'front-end';
      if (!nodefs.existsSync(dir)){
        nodefs.mkdirSync(dir);
      }
      dir = 'front-end/mocks';
      if (!nodefs.existsSync(dir)){
        nodefs.mkdirSync(dir);
      }
      nodefs.writeFile('front-end/mocks/roles.json',JSON.stringify(rolesJSON),function(err){
        if(err) throw err;
      })
    },
    app: function() {
      var thisRef = this;

      //backend files
     function generateBackendSkeleton(){
       var baseFiles = ["index.js", "routes.js", "config.js"]
       baseFiles.forEach(function(item){
         thisRef.fs.copyTpl(
           thisRef.templatePath('back-end/' + item ),
           thisRef.destinationPath('back-end/' + item), {
             name: thisRef.props.name
           }
         );
       })
       var modelConfigs = ["notice.json", "user.json"];
       modelConfigs.forEach(function(item){
         thisRef.fs.copyTpl(
           thisRef.templatePath('back-end/configs/models/' + item ),
           thisRef.destinationPath('back-end/configs/models/' + item), {
             name: thisRef.props.name
           }
         );
       })
       var controllers = {
         auth: ["authenticate.js", "changePassword.js","createAccount.js", "updateProfile.js", "validateToken.js"],
         connection: ["connect.js","getConnection.js"],
         crud: ["deleteById.js", "getById.js", "getMany.js", "index.js", "insert.js", "update.js", "deleteMany.js", "upload.js"]
       };
       for(var key in controllers){
         controllers[key].forEach(function (item) {
           thisRef.fs.copyTpl(
             thisRef.templatePath('back-end/controllers/' + key + "/" + item ),
             thisRef.destinationPath('back-end/controllers/' + key + "/" + item), {
               name: thisRef.props.name
             }
           );
         });
       };

       var middlewares = ["crudAuthorize.js"];
       middlewares.forEach(function (item) {
         thisRef.fs.copyTpl(
           thisRef.templatePath('back-end/middlewares/' + item ),
           thisRef.destinationPath('back-end/middlewares/' + item), {
             name: thisRef.props.name
           }
         );
       });

       var models = ["user.js", "index.js", "notice.js", "connection.js"]
       models.forEach(function (item) {
         thisRef.fs.copyTpl(
           thisRef.templatePath('back-end/models/' + item ),
           thisRef.destinationPath('back-end/models/' + item), {
             name: thisRef.props.name
           }
         );
       });

       var services = ["tokenDecoder.js"]
       services.forEach(function (item) {
         thisRef.fs.copyTpl(
           thisRef.templatePath('back-end/services/' + item ),
           thisRef.destinationPath('back-end/services/' + item), {
             name: thisRef.props.name
           }
         );
       });
     }
      generateBackendSkeleton();

      function generateFrontendSkeleton(){
        var baseFiles = ["index.html", "require-main.js"];
        baseFiles.forEach(function(item){
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/' + item ),
            thisRef.destinationPath('front-end/' + item), {
              name: thisRef.props.name
            }
          );
        })
        var externalfiles = ["requirejs/require.js"];
        externalfiles.forEach(function(item){
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/external-files/' + item ),
            thisRef.destinationPath('front-end/external-files/' + item), {
              name: thisRef.props.name
            }
          );
        })

        var styles = ["bootstrap-theme.min.css", "preloader.css"];
        styles.forEach(function(item){
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/styles/' + item ),
            thisRef.destinationPath('front-end/styles/' + item)
          );
        })

        var mocks = {
          "base": ["initial-modules.json", "template-config.admin.json", "template-config.visitor.json"]
        }
        var roles = thisRef.props.roles;
        roles = roles.split(',');
        roles.forEach(function (role) {
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/mocks/template-config.user.json'),
            thisRef.destinationPath('front-end/mocks/template-config.'+ role +'.json'), {
              name: thisRef.props.name
            }
          );
        });
        for(var key in mocks){
          mocks[key].forEach(function(item){
            thisRef.fs.copyTpl(
              thisRef.templatePath('front-end/mocks/'+ (key=="base"? "":(key + "/")) + item ),
              thisRef.destinationPath('front-end/mocks/'+(key=="base"? "":(key + "/")) + item ), {
                name: thisRef.props.name
              }
            );
          })
        }

        var directives = ["app-loader.js"];
        directives.forEach(function(item){
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/directives/' + item ),
            thisRef.destinationPath('front-end/directives/' + item)
          );
        })

        var mainApp = {
          controllers:["indexController.js"],
          services: ["env.service.js"],
          styles: ["main.css"],
          base: ["mainApp.config.js"]
        }
        for(var key in mainApp){
          mainApp[key].forEach(function(item){
            thisRef.fs.copyTpl(
              thisRef.templatePath('front-end/apps/mainApp/'+(key=="base"? "":(key + "/")) + item ),
              thisRef.destinationPath('front-end/apps/mainApp/'+(key=="base"? "":(key + "/")) + item )
            );
          })
        }

        var others = ["access-denied.view.html", "not-found.view.html"];
        others.forEach(function(item){
          thisRef.fs.copyTpl(
            thisRef.templatePath('front-end/apps/others/' + item ),
            thisRef.destinationPath('front-end/apps/others/' + item)
          );
        });

        var apps = {
          business: {
            "login": {
              controllers: ["login.controller.js", "logout.controller.js"],
              styles: ["login.css"],
              views: ["login.view.html", "logout.view.html"],
              base:["login.config.js", "login.dev.json"]
            },
            "user-management":{
              controllers: ["all-users.controller.js", "create-user.controller.js",
                "delete-user-confirmation.controller.js", "edit-user-modal.controller.js", "view-user.controller.js" ],
              views: ["all-users.view.html", "create-user.view.html",
                "delete-user-confirmation-modal.view.html", "edit-user-modal.view.html", "view-user-modal.view.html" ],
              base:["user-management.config.js", "user-management.dev.json"],
              services: ["user.service.js"]
            },
            "sign-up": {
              controllers: ["sign-up.controller.js", "profile.controller.js"],
              styles: ["sign-up.css"],
              views: ["sign-up.view.html", "profile.view.html"],
              base:["sign-up.config.js", "sign-up.dev.json"]
            },
            "notice":{
              controllers: ["all-notices.controller.js", "create-notice.controller.js",
                "delete-notice-confirmation.controller.js", "edit-notice-modal.controller.js",
                "view-notice-modal.controller.js", "notice-board.controller.js" ],
              styles: ["notice.css"],
              views: ["all-notices.view.html", "create-notice.view.html",
                "delete-notice-confirmation-modal.view.html", "edit-notice-modal.view.html",
                "view-notice-modal.view.html", "notice-board.view.html" ],
              base:["notice.config.js", "notice.dev.json"],
              services: ["notice.service.js"]
            }
          },
          infrastructure: {
            "template": {
              base: ["template.config.js", "template.dev.json"],
              controllers: ["template.controller.js"],
              services: ["template-service.service.js"],
              styles: ["template.css"],
              views: ["template.view.html"]
            },
            "security":{
              base: ["security.config.js", "security.dev.json"],
              factories: ["authorizer.factory.js", "identifier.factory.js"]
            },
            "formly-app": {
              base: ["formly-app.config.js", "formly-app.dev.json"],
              directives: ["datetimepicker.js"]
            },
            "file-uploader": {
              base: ["file-uploader.dev.json", "file-uploader.config.js"]
            },
            "core-services": {
              base: ["core-services.dev.json", "core-services.config.js", "data-manupulator.service.js"]
            },
            "core-directives": {
              base: ["core-directives.dev.json", "core-directives.config.js", "app-loader.directive.js"]
            },
            "angular-data-table": {
              base: ["angular-data-table.dev.json", "angular-data-table.config.js"]
            }
          },
          public: {
            landing: {
              controllers: ["landing.controller.js"],
              views:["landing.view.html"]
            },
            "home": {
              controllers: ["home.controller.js", "about-us.controller.js"],
              views: ["home.view.html", "about-us.view.html"],
              base:["home.config.js", "home.dev.json"]
            }
          }
        }

        for(var key1 in apps){
          for(var key2 in apps[key1]){
            for(var key3 in apps[key1][key2]){
              apps[key1][key2][key3].forEach(function(item){
                thisRef.fs.copyTpl(
                  thisRef.templatePath('front-end/apps/'+ key1 + "/" + key2 + "/" + (key3=="base"?"":key3) + "/" + item ),
                  thisRef.destinationPath('front-end/apps/'+ key1 + "/" + key2 + "/" + (key3=="base"?"":key3) + "/" + item)
                );
              });
            }
          }
        }


      }
      generateFrontendSkeleton();

    }
  },
  install: function() {
    this.bowerInstall();
  }

//Install Dependencies
});
