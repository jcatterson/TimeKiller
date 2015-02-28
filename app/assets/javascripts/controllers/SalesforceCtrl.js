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
  var Query = $resource( '/salesforce/query', {}, {query: query} );

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  $scope.query = function(){
    var the_query = $scope.codeWindow.getValue();
    var params = { "query" : the_query };
    Query.query( params, function(res){
      $scope.theQuery = new SOQL( the_query );
      $scope.sObjects = createSObjects( res, described_objects );
    });
  }

  $scope.describe_sobject = function(sobject_to_describe){
    if( !described_objects[sobject_to_describe] ){
      description = Describe.query({"sobject":sobject_to_describe}, function(res){
        described_objects[sobject_to_describe] = res;
        $scope.described_sobject = res;
        initializeSOQL();
      });
    }
    else{
      $scope.described_sobject = described_objects[sobject_to_describe];
      initializeSOQL();
    }
  }

  initializeSOQL = function(){
    var describedObject = $scope.described_sobject;
    var first_field = describedObject.sobject.fields[0];
    $scope.codeWindow.setValue( "Select " + first_field.name + ", from " + describedObject.sobject.name );
    $scope.codeWindow.focus();
    $scope.codeWindow.doc.setCursor( {line:0, ch:"Select ".length + first_field.name.length + 1} );
  }

  sobject_is_like_search_term = function( sobject ){
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }

  var original_sobject_list;
  var described_objects = {}
  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });
}])
.directive('sobjectList', function(){
  return{
    restrict: 'E',
    templateUrl: '/templates/salesforce/sobject_list.html'
  }
});
