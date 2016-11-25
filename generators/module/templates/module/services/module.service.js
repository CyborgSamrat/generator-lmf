define(['angular'], function (angular) {

    angular.module('<%= lname %>').service('<%= lname %>Service', ['$http', "$rootScope","$q", function ($http, $rootScope,$q) {
        var baseUrl = "http://localhost:3000/";
      var <%= lname %>ToBeEdited;
      var <%= lname %>sToBeDeleted;
      var activeModal;
      var <%= lname %>ToBeViewed;


        function manupulate(action, data){
            return $q(function(resolve, reject){
                $http({
                    method: 'POST',
                    url: baseUrl + action,
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                }).then(function(response){
                    resolve(response);
                }, function(err){
                    reject(err);
                });
            })
        };

      function set<%= uname %>ToBeEdited(<%= lname %>) {
        <%= lname %>ToBeEdited = <%= lname %>;
      }
      function get<%= uname %>ToBeEdited() {
        return <%= lname %>ToBeEdited ;
      }

      function set<%= uname %>ToBeViewed(<%= lname %>) {
        <%= lname %>ToBeViewed = <%= lname %>;
      }
      function get<%= uname %>ToBeViewed() {
        return <%= lname %>ToBeViewed ;
      }

      function setModal(modal) {
        activeModal = modal;
      }
      function getModal() {
        return activeModal;
      }

      function set<%= uname %>sToBeDeleted(<%= lname %>s) {
        <%= lname %>sToBeDeleted = <%= lname %>s;
      }

      function get<%= uname %>sToBeDeleted() {
        return <%= lname %>sToBeDeleted;
      }
      this.manupulate = manupulate;
      this.set<%= uname %>ToBeEdited = set<%= uname %>ToBeEdited;
      this.get<%= uname %>ToBeEdited = get<%= uname %>ToBeEdited;
      this.set<%= uname %>sToBeDeleted = set<%= uname %>sToBeDeleted;
      this.get<%= uname %>sToBeDeleted = get<%= uname %>sToBeDeleted;
      this.setModal = setModal;
      this.getModal = getModal;
      this.set<%= uname %>ToBeViewed = set<%= uname %>ToBeViewed;
      this.get<%= uname %>ToBeViewed = get<%= uname %>ToBeViewed;

    }]);
});
