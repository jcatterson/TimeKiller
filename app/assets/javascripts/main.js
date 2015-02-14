var app = angular.module("app", ["ngResource", "ngRoute"]);
app.config(['$routeProvider', function($routeProvider){
  $routeProvider.otherwise( {
    templateUrl: '../templates/index.html'
  });
}]);
