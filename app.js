(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

        ctrl.foundItems = [];
        ctrl.search = function (searchTerm) {
            ctrl.foundItems = [];
            if (!searchTerm)
                return;
            ctrl.foundItems = [];
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
            promise.then(function (result) {
                ctrl.foundItems = result;
            },
            function (error) {
                console.log(error);
            });
        };
        ctrl.removeItem = function (index) {
            ctrl.foundItems.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var URL = 'https://davids-restaurant.herokuapp.com/menu_items.json';

        var service = this;
        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                url: URL
            })
            .then(
                function success(response) {
                    return response.data.menu_items.filter(function (item) {
                        return item.description.indexOf(searchTerm) != -1;
                    });
                },
                function error(response) {
                    console.log("ERROR");
                }
            );
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                removedOn: '&onRemove'
            }
        };
        return ddo;
    }


})();
