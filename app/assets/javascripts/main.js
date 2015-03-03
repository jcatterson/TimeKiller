var app = angular.module("app", ["ngResource", "ngRoute"]);
app.config(['$routeProvider', function($routeProvider){
  $routeProvider.otherwise( {
    templateUrl: '../templates/index.html'
  });
}]);
app.directive('sobjectResults', function(){
  return{
    restrict: 'E',
    scope: {
      queryInfo: '=query',
      sObjects: '=sobjects'
    },
    templateUrl: '/templates/salesforce/sobject_results.html'
  };
})
.directive('uiCodeMirror', ["sObjectDescribe", function(sObjectDescribeFactory){
    return {
      restrict: "A",
      link: function( scope, element, attrs ){
        CodeMirror.commands.autocomplete = function(cm){
          var tbls = JSON.parse( attrs.tables );
          cm.showHint({
                        hint: CodeMirror.hint.soql,
                        options: { tables : scope.tables }
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
])
.factory("sObjectDescribe", ["$resource", function sObjectDescribe($resource){
  var sObjects = {}

  this.listsObjects = function( yield ){
    var query = { method: 'GET',
                  headers:{ 'Accept':'application/json' },
                  isArray: true
                };
    var Salesforce = $resource( '/salesforce/sobject_list', {}, {query: query} );
    return Salesforce.query( function(result){
      yield( result );
    });
  }

  this.describe = function(sObject){
    console.log("no no");
  }

  return this;
}]);
