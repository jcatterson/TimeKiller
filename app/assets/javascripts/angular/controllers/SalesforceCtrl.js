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
  var described_objects = {}
  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  $scope.describe_sobject = function(sobject_to_describe){
    if( !described_objects[sobject_to_describe] ){
      description = Describe.query({"sobject":sobject_to_describe}, function(res){
        described_objects[sobject_to_describe] = res.body;
        $scope.described_sobject = res.body;
      });
    }
    else{
      $scope.described_sobject = described_objects[sobject_to_describe];
    }
  }

  sobject_is_like_search_term = function( sobject ){
    window.sobject = $scope.sobject_search;
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }
}])
.directive('sobjectList', function(){
  return{
    templateUrl: '/templates/salesforce/sobject_list.html'
  }
});