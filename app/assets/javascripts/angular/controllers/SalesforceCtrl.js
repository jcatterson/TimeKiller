app.controller("SalesforceCtrl", ['$scope', "$resource", function($scope, $resource){
  var query = { method: 'GET',
                headers:{ 'Accept':'application/json' },
                isArray: true
              }
  var Salesforce = $resource( '/salesforce/index', {}, {query: query} );
  var original_sobject_list;
  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  sobject_is_like_search_term = function( sobject ){
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }
}]);