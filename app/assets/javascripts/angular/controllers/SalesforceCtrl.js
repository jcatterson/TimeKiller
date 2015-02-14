app.controller("SalesforceCtrl", ['$scope', "$resource", function($scope, $resource){
  var query = { method: 'GET',
                headers:{ 'Accept':'application/json' },
                isArray: true
              };
  var describe = { method: 'GET',
                headers:{ 'Accept':'application/json' },
                isArray: false
              };
  var Salesforce = $resource( '/salesforce/sobject_list', {}, {query: query} );
  var Describe = $resource( '/salesforce/describe', {}, {query: describe} );
  var original_sobject_list;
  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  $scope.describe_sobject = function(sobject_to_describe){
    description = Describe.query({"sobject":sobject_to_describe});
    console.log( description );
  }

  sobject_is_like_search_term = function( sobject ){
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }
}]);