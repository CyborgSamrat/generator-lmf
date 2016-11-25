define(['angular'], function (angular) {

    var <%= lname %> = angular.module('<%= lname %>').controller('view<%= uname %>Controller',
        ['$scope', '$http','$q',"$rootScope",'dataManupulator','FileUploader','<%= lname %>Service',
          function (scope, http,$q,$rootScope, dataManupulator, FileUploader, <%= lname %>Service) {

            scope.pageTitle = "Create <%= uname %>";
            scope.baseUrl = "http://localhost:3000/";
            scope.bgColor = "background-color: BurlyWood";
            var <%= lname %>ToBeViewed;
            var modalInstance;
            function init() {
              <%= lname %>ToBeViewed = <%= lname %>Service.get<%= uname %>ToBeViewed();
              modalInstance = <%= lname %>Service.getModal();
              scope.<%= lname %> = <%= lname %>ToBeViewed;
            }
            init();

            scope.cancel = function () {
              modalInstance.close();
            }


        }]);


    return <%= lname %>;
});

