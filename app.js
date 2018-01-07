(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.controller('foundItemsDirectiveController', foundItemsDirectiveController)
.service('MenuCategoriesService', MenuCategoriesService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);



function FoundItemsDirective() {
  var ddo = {
    templateUrl : 'foundItems.html',
    scope : {
      founditems : '<',
      onRemove   : '&'
    },
    controller : foundItemsDirectiveController,
    controllerAs : 'fmenu',
    bindToController: true

   };
   return ddo;
}

function foundItemsDirectiveController() {
  var fmenu = this;
}


NarrowItDownController.$inject = ['MenuCategoriesService'];
function NarrowItDownController(MenuCategoriesService) {
  var menu = this;

  var promise = MenuCategoriesService.getMenuForCategory();

    promise.then(function (response) {
      menu.data=response.data;
      console.log(response.data);

    })
    .catch(function (error) {
      console.log(error);
    });

  menu.founditems = [];

  menu.searchItem = "";
  menu.logSearchItem = function (searchItem) {
    for (var i = 0; i < menu.data.menu_items.length; i++) {
      var description = menu.data.menu_items[i].description;
      console.log(description);
      console.log(searchItem);
      if(searchItem.toLowerCase().search(description.toLowerCase()) !== -1)
      {
        var item = {
          short_name:  menu.data.menu_items[i].short_name,
          name :  menu.data.menu_items[i].name
        };
        menu.founditems.push(item);

      }
      else {
        console.log("Not Found");
      }
      console.log(menu.found_item);
    }

  };

  menu.removeItem = function (itemIndex) {
    menu.founditems.splice(itemIndex, 1);
  };

}


MenuCategoriesService.$inject = ['$http', 'ApiBasePath'];
function MenuCategoriesService($http, ApiBasePath) {
  var service = this;

  service.getMenuForCategory = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    return response;
  };



}

})();
