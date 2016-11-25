define(['angular'], function (angular) {

    var <%= lname %> = angular.module('<%= lname %>').controller('edit<%= uname %>Controller',
        ['$scope', 'identifier','$q','dataManupulator','FileUploader','<%= lname %>Service','toastr',
          function (scope, identifier,$q, dataManupulator, FileUploader, <%= lname %>Service, toastr) {

            scope.pageTitle = "Create <%= uname %>";
            var <%= lname %>ToBeEdited;
            var modalInstance;
            function init() {
              <%= lname %>ToBeEdited = <%= lname %>Service.get<%= uname %>ToBeEdited();
              modalInstance = <%= lname %>Service.getModal();
              scope.<%= lname %>Model = <%= lname %>ToBeEdited;
            }
            init();

            scope.cancel = function () {
              modalInstance.close();
            }

            var <%= lname %>s = [];

              scope.<%= lname %>Schema = [
                  {
                      key: 'title',
                      type: 'input',
                      templateOptions: {
                          type: 'text',
                          label: '<%= uname %> Title',
                          placeholder: 'Enter the <%= lname %> title',
                          required: true
                      }
                  },
                  {
                      key: 'description',
                      type: 'textarea',
                      templateOptions: {
                          type: 'text',
                          label: 'Details',
                          placeholder: 'Enter details',
                          required: true,
                          rows: 10
                      }
                  }
              ];

            scope.edit<%= uname %> = function(){
                var model = {
                  "entityName": "<%= lname %>",
                  "entityId": <%= lname %>ToBeEdited._id
                };
                model.entity = scope.<%= lname %>Model;
                identifier.identity().then(
                    function(res){
                        model.entity.updatedById = res.userId;
                        dataManupulator.manupulate("update",model).then(
                            function (response) {
                                toastr.success("<%= uname %> updated", "Success!");
                            },
                            function (err) {
                                toastr.error("Failed to update <%= lname %>", "Error!");
                            }
                        );
                    }
                )
              scope.cancel();
            }

        }]);


    return <%= lname %>;
});

