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
  var codeWindow = CodeMirror.fromTextArea( document.getElementById( 'soql_query' ), {
    lineNumbers: true,
    extraKeys: {"Ctrl-Space": "autocomplete"},
    mode: "sql"
  });

  $scope.sobjects = Salesforce.query( function(result){
    original_sobject_list = _.clone( result );
  });

  $scope.sobjects_like = function(){
    $scope.sobjects = _(original_sobject_list).filter( sobject_is_like_search_term ).value();
  }
  
  $scope.query = function(){
    var the_query = codeWindow.getValue();
    var params = { "query":codeWindow.getValue() };
    Query.query( params, function(res){
      var queryString = the_query.toUpperCase();
      queryString = simpleSqlParser.sql2ast( queryString );
      var sobjects = formatColsForPage( res, queryString["SELECT"] );
      $scope.query_results = {"queryString":queryString, "sobjects":sobjects};
    });
  }

  formatColsForPage = function( sobjects, cols ){
    var formatted = [];
    for( var i = 0; i < sobjects.length; i++ ){
      var sobject = sobjects[i];
      sobject = formatSObject( sobject );
      var formattedSObject = {};
      for( colIndex in cols ){
        var col = cols[colIndex].name;
        var sobjectSplit = col.split('.');
        var currentSObject = sobject;
        for( colNameIndex in sobjectSplit ){
          var colName = sobjectSplit[colNameIndex].toUpperCase();
          currentSObject = currentSObject[colName];
          if( !currentSObject ){
            currentSObject = "";
            break;
          }
          else if( typeof currentSObject === 'object' ){
            currentSObject = formatSObject( currentSObject );
          }
        }
        formattedSObject[col] = currentSObject;
      }
      formatted.push( formattedSObject );
    }
    return formatted;
  }

  formatSObject = function( sobject ){
    var formattedSobject = {};
    var cols = listColumnNames( sobject );
    for( var colIndex in cols ){
      var colName = cols[colIndex];
      var colVal = sobject[colName];
      colName = colName.toUpperCase();
      formattedSobject[colName] = colVal;
    }
    return formattedSobject;
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
    codeWindow.setValue( "Select " + first_field.name + ", from " + describedObject.sobject.name );
    codeWindow.focus();
    window.txt = codeWindow;
    codeWindow.doc.setCursor( {line:0, ch:"Select ".length + first_field.name.length + 1} );
  }

  sobject_is_like_search_term = function( sobject ){
    return sobject.toUpperCase().indexOf( $scope.sobject_search.toUpperCase() ) >= 0;
  }

  listColumnNames = function( sobject ){
    var colNames = [];
    for( var col in sobject ){
      colNames.push( col );
    }
    return colNames;
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
});