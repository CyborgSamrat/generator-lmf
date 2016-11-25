define(['angular'], function (angular) {

    var <%= lname %> = angular.module('<%= lname %>').controller('<%= lname %>sController',
        ['$scope', '$http', "$uibModal", 'dataManupulator', '<%= lname %>Service',
            function (scope, http, $uibModal, dataManupulator, <%= lname %>Service) {
                scope.loading = true;
                scope.totalItems = 0;
                scope.<%= lname %>s = [];
                scope.pageSize = 10;
                scope.selected<%= uname %>s = [];
                scope.$watchCollection("selected<%= uname %>s", function () {
                    if (scope.selected<%= uname %>s.length == 1) {
                        scope.showMenu = true;
                        scope.multiSelect = false;
                    } else if (scope.selected<%= uname %>s.length > 1) {
                        scope.showMenu = true;
                        scope.multiSelect = true;
                    } else scope.showMenu = false;
                });

                scope.$on("<%= lname %>-deleted", function (e, arg) {
                    if (arg.ids) {
                        arg.ids.forEach(function (id) {
                            scope.all<%= uname %>s.forEach(function (item, index) {
                                if (item._id == id) {
                                    delete scope.all<%= uname %>s[index];
                                    scope.totalItems--;
                                    scope.selected<%= uname %>s = [];
                                }
                            })
                        })
                    }
                })

                scope.editSelected = function () {
                    <%= lname %>Service.set<%= uname %>ToBeEdited(scope.selected<%= uname %>s[0]);
                    var modal = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title-top',
                        ariaDescribedBy: 'modal-body-top',
                        templateUrl: 'apps/<%= type%>/<%= lname %>/views/edit-<%= lname %>-modal.view.html',
                        controller: 'edit<%= uname %>Controller'
                    });
                    <%= lname %>Service.setModal(modal);
                }
                scope.viewSelected = function () {
                    <%= lname %>Service.set<%= uname %>ToBeViewed(scope.selected<%= uname %>s[0]);
                    var modal = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title-top',
                        ariaDescribedBy: 'modal-body-top',
                        templateUrl: 'apps/<%= type%>/<%= lname %>/views/view-<%= lname %>-modal.view.html',
                        controller: 'view<%= uname %>Controller'
                    });
                    <%= lname %>Service.setModal(modal);
                }

                scope.deleteSelected = function () {
                    <%= lname %>Service.set<%= uname %>sToBeDeleted(scope.selected<%= uname %>s);
                    var modal = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title-top',
                        ariaDescribedBy: 'modal-body-top',
                        templateUrl: 'apps/<%= type%>/<%= lname %>/views/delete-<%= lname %>-confirmation-modal.view.html',
                        controller: 'delete<%= uname %>Controller'
                    });
                    <%= lname %>Service.setModal(modal);
                }

                var getManyFilter = {
                    entityName: "<%= lname %>",
                    pageNumber: 1,
                    pageSize: scope.pageSize,
                    sort: {},
                    filters: {}
                }

                var filter = {};
                scope.updateTableBy<%= uname %> = function (flag) {
                    if (flag) {
                        filter.<%= lname %>Id = scope.selected<%= uname %>._id
                    }
                    else {
                        delete filter.<%= lname %>Id;
                        scope.selected<%= uname %> = null;

                    }
                    ;
                    scope.loadMore(0, scope.pageSize, null, filter, null, null);

                }

                scope.loadMore = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
                    scope.loading = true;
                    makePartialSearchFilter(filterByFields);
                    getManyFilter.pageNumber = currentPage + 1;
                    getManyFilter.pageSize = pageItems;
                    getManyFilter.sort.sortBy = orderBy;
                    getManyFilter.filters = filter;
                    getAll<%= uname %>();
                    scope.selected<%= uname %>s = [];
                }

                function makePartialSearchFilter(object) {
                    filter = {};
                    for (var key in object) {
                        filter[key] = {
                            $regex: object[key]
                        };
                    }

                }

                var getAll<%= uname %>Filter = {
                    entityName: "<%= lname %>",
                    pageNumber: 1,
                    pageSize: 1000000
                }


                function getAll<%= uname %>() {
                    dataManupulator.manupulate("getMany", getAll<%= uname %>Filter).then(function (response) {
                        scope.<%= lname %>s = response.data.data;
                    })
                }

                function getAll<%= uname %>() {
                    dataManupulator.manupulate("getMany", getManyFilter).then(function (response) {
                        scope.all<%= uname %>s = response.data.data;
                        scope.totalItems = response.data.totalCount;
                        scope.loading = false;

                        if (angular.isArray(scope.all<%= uname %>s)) {
                            scope.all<%= uname %>s.forEach(function (item, index) {
                                dataManupulator.manupulate("getById", {
                                    entityName: '<%= lname %>',
                                    entityId: item.<%= lname %>Id
                                }).then(function (res) {
                                    scope.all<%= uname %>s[index].<%= lname %> = res.data.title;
                                })
                            })
                        }
                    })
                }

                //getAll<%= uname %>();

                scope.pageTitle = "All <%= uname %>s";

                scope.options = {
                    scrollbarV: false
                };
                function init() {
                    getAll<%= uname %>();
                }

                init();
            }]);


    return <%= lname %>;
});

