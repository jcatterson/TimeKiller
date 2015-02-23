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
  var original_sobject_list;
  var described_objects = {}

  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }

  $scope.query = function(){
    var the_query = $scope.codeWindow.getValue();
    var params = { "query":the_query };
    Query.query( params, function(res){
      var queryString = readSOQL( the_query );
      var columns = getColumns( queryString );
      var sobjects = createSObjects( res, described_objects );
      $scope.query_results = {"queryString":columns, "sobjects":sobjects};
    });
  }

  getColumns = function( queryString ){
    var cols = [];
    var soqlCols = queryString["SELECT"];
    for( var i = 0; i < soqlCols.length; i++ ){
      var currentCol = soqlCols[i];
      var innerQuery = currentCol["SELECT"];
      if( currentCol.name ){
        cols.push( currentCol.name );
      }
      else if( innerQuery ){
        console.log("Hey inner query" );
        var tableName = currentCol["FROM"][0].table;
        for( var j = 0; j < innerQuery.length; j++ ){
          col = tableName + "." + innerQuery[j].name;
          cols.push( col );
        }
      }
    }
    return cols;
  }

  readSOQL = function( theQuery ){
    var queryString = theQuery.toUpperCase();
    queryString = simpleSqlParser.sql2ast( queryString );
    var columns = queryString["SELECT"];
    for( var i = 0; i < columns.length; i++ ){
      var col = columns[i].name;
      if( col.indexOf("(") == 0 && col.lastIndexOf(")") == col.length - 1){
        var innerQuery = col.substring(1, col.length-1);
        columns[i] = simpleSqlParser.sql2ast( innerQuery );
      }
    }
    return queryString;
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
}])
.directive('sobjectList', function(){
  return{
    templateUrl: '/templates/salesforce/sobject_list.html'
  }
})
.directive('sobjectResults', function(){
  return{
    templateUrl: '/templates/salesforce/sobject_results.html'
  }
})
.directive('uiCodeMirror', [
  function(){
    return {
      restrict: "A",
      link: function( scope, element, attrs ){
        CodeMirror.commands.autocomplete = function(cm){
          cm.showHint({
                        hint: CodeMirror.hint.soql,
                        options: {
                          tables: {
                            "abc":["Test", "TEst"],
                            "def":["1", "2", "3"]
                          },
                          defaultTable: "abc"
                        }
                    });
        }

        scope.codeWindow = CodeMirror.fromTextArea( element[0], {
          lineNumbers: true,
          extraKeys: {"Ctrl-Space": "autocomplete"},
          mode: "sql"
        });
      }
    }
  }
]);