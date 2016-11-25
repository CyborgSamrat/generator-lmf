define(['angular'], function (angular) {

    var user = angular.module('user-management').controller('createUserController',
        ['$scope', '$http','$q','$state','dataManupulator','FileUploader', 'toastr',
            function (scope, http,$q,$state, dataManupulator, FileUploader, toastr) {

            scope.pageTitle = "Create User";
                scope.options = {};

           var uploader= scope.uploader = new FileUploader({
                url: "http://localhost:3000/upload",
                autoUpload: true
           });

          scope.fileAcceptTypes = "image/gif, image/jpeg, image/png, image/jpg, image/bmp";

          uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
          });

          scope.uploadInprogress = false;
          scope.uploadingImgFor = null;
          scope.updateUploadingImgInfo = function(info){
            scope.uploadingImgFor = info;
          };


              var roles = [
                {
                  name: "Manager",
                  value:"manager"
                },
                {
                  name: "Customer",
                  value:"customer"
                },
                {
                  name: "Employee",
                  value:"employee"
                }
              ];

        scope.userSchema = [
          {
            key: 'roles',
            type: 'select',
            templateOptions: {
              label: 'Role',
              placeholder: 'Select a role',
              options:roles,
              required: true
            }
          },
            {
                key: 'userName',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'User Name',
                    placeholder: 'Enter the user name',
                    required: true
                }
            },
            {
                key: 'userEmail',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'User Email',
                    placeholder: 'Enter user email',
                    required: true
                }
            },
            {
                key: 'phoneNumber',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'Phone Number',
                    placeholder: 'Enter phone number'
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Password',
                    placeholder: 'Enter password',
                    required: true
                }
            }
        ]


            scope.createUser = function(){
                var model = scope.userModel;
                dataManupulator.manupulate("createAccount",model).then(
                    function (response) {
                        if(response.data.success){
                            toastr.success("User created", "Success");
                            $state.go('all-users');
                        }
                        else{
                            toastr.error(response.data.message, "Error");
                        }
                    }
                );
            }



          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
          };
          uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
          };
          uploader.onBeforeUploadItem = function(item) {
            scope.uploadInprogress = true;
            console.info('onBeforeUploadItem', item);
          };
          uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
          };
          uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
          };
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
          };
          uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
          };
          uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
            scope.uploadInprogress = false;
            setImgPathToDatabase(response);
            console.info('onCompleteItem', fileItem, response, status, headers);
          };
          uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
          };

        }]);


    return user;
});

