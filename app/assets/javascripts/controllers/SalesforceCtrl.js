app.controller("SalesforceCtrl", ['$scope', "$resource", "jc_SFDC", function($scope, $resource, jc_SFDC){

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  $scope.query = function(){
    var usersQuery = $scope.codeWindow.getValue();
    jc_SFDC.query( usersQuery, function(res){
      $scope.theQuery = new SOQL( usersQuery );
      $scope.sObjects = createSObjects( res, described_objects );
    });
  }

  $scope.describe_sobject = function(sobject_to_describe){
    jc_SFDC.describe( sobject_to_describe, function(res){
        $scope.described_sobject = res;
        initializeSOQL();
    });
  }

  initializeSOQL = function(){
    var describedObject = $scope.described_sobject;
    var first_field = describedObject.fields[0];
    $scope.codeWindow.setValue( "Select " + first_field.name + ", from " + describedObject.name );
    $scope.codeWindow.focus();
    $scope.codeWindow.doc.setCursor( {line:0, ch:"Select ".length + first_field.name.length + 1} );
  }

  sobject_is_like_search_term = function( sobject ){
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }

  var original_sobject_list;
  var described_objects = {}
  $scope.sobjects = jc_SFDC.listsObjects( function(result){
    original_sobject_list = _.clone( result );
  });
}])
.directive('sobjectList', function(){
  return{
    restrict: 'E',
    templateUrl: '/templates/salesforce/sobject_list.html'
  }
});
