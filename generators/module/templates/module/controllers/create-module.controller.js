define(['angular'], function (angular) {

    var <%= lname %> = angular.module('<%= lname %>').controller('create<%= uname %>Controller',
        ['$scope', '$state','toastr','dataManupulator','identifier', function (scope,$state, toastr, dataManupulator, identifier) {

            scope.pageTitle = "Create <%= lname %>";

            scope.<%= lname %>Model = {};

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
                        type: 'input',
                        label: 'Details',
                        placeholder: 'Enter details',
                        required: true,
                        rows: 10
                    }
                }
            ]


            scope.create<%= uname %> = function(){
                var model = {
                    "entityName": "<%= lname %>"
                };
                model.entity = scope.<%= lname %>Model;
                dataManupulator.manupulate("insert",model).then(function (res) {
                    if(res.data.success){
                        toastr.success("<%= uname %> created", "Success!");
                        $state.go("all-<%= lname %>s");
                    } else{
                        toastr.error("Failed to create sucject", "Error!");
                    }
                }, function (err) {
                    toastr.error("Something went wrong, failed to create <%= lname %>", "Error");
                });
            }

        }]);

});

