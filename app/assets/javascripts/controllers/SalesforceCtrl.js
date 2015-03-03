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
    if( !described_objects[sobject_to_describe] ){
      description = jc_SFDC.describe( sobject_to_describe, function(res){
        described_objects[sobject_to_describe] = res;
        $scope.described_sobject = res;
        var matchingTbl = _.find( $scope.tables, function( tbl ){
                            return tbl.tableName.toUpperCase() == sobject_to_describe.toUpperCase();
                          });
        matchingTbl.columns = [];
        for( var i = 0; i < res.sobject.fields.length; i++ ){
          var field = res.sobject.fields[i];
          matchingTbl.columns.push( field.name );
        }
        matchingTbl.columns.sort();
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
  $scope.sobjects = jc_SFDC.listsObjects( function(result){
    original_sobject_list = _.clone( result );
    $scope.tables = [];
    for( var i = 0; i < original_sobject_list.length; i++ ){
      $scope.tables.push({
        tableName : original_sobject_list[i],
        columns : ["Id"]
      });
    }
  });
}])
.directive('sobjectList', function(){
  return{
    restrict: 'E',
    templateUrl: '/templates/salesforce/sobject_list.html'
  }
});
