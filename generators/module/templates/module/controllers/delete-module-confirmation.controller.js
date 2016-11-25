define(['angular'], function (angular) {

    var <%= lname %> = angular.module('<%= lname %>').controller('delete<%= uname %>Controller',
        ['$scope', '$state','$q',"$rootScope",'dataManupulator','FileUploader','<%= lname %>Service','toastr',
          function (scope, $state,$q,$rootScope, dataManupulator, FileUploader, <%= lname %>Service, toastr) {

            scope.pageTitle = "Create <%= uname %>";
            var <%= lname %>ToBeEdited;
            var modalInstance;
            function init() {
              <%= lname %>sToBeDeleted = <%= lname %>Service.get<%= uname %>sToBeDeleted();
              modalInstance = <%= lname %>Service.getModal();
              scope.<%= lname %>s = <%= lname %>sToBeDeleted;
            }
            init();

            scope.cancel = function () {
              modalInstance.close();
            }

            scope.delete<%= uname %>s = function(){
                var model = {
                  "entityName": "<%= lname %>",
                  "entityIds":[]
                };
                <%= lname %>sToBeDeleted.forEach(function (item) {
                  model.entityIds.push(item._id);
                })
              dataManupulator.manupulate("deleteMany",model).then(
                  function (response) {
                      toastr.success("<%= uname %> deleted", "Success!");
                      $state.go('all-<%= lname %>s');
                  },
                  function (err) {
                      toastr.error("Failed to delete <%= lname %>", "Error!");
                  }
              );
              scope.cancel();
              $rootScope.$broadcast("<%= lname %>-deleted", {ids:model.entityIds});
            }


        }]);


    return <%= lname %>;
});

