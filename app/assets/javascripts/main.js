var app = angular.module("app", ["ngResource"]);
app.controller("SalesforceCtrl", ['$scope', "$resource", function($scope, $resource){
  var query = { method: 'GET',
                headers:{ 'Accept':'application/json' },
                isArray: true
              }
  var Salesforce = $resource( '/salesforce/index', {}, {query: query} );
  $scope.sobjects = Salesforce.query();
}]);