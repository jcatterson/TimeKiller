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
.directive('uiCodeMirror', ["jc_SFDC", function(jc_SFDC){
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
.factory("jc_SFDC", ["$resource", function jc_SFDC($resource){
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

  this.describe = function(sObjectToDescribe, yield){
    var describe = { method: 'GET',
                     headers:{ 'Accept':'application/json' },
                     isArray: false
                };
    var Describe = $resource( '/salesforce/describe', {}, {query: describe} );
    return Describe.query( {"sobject":sObjectToDescribe}, function(res){
      yield(res);
    });
  }

  this.query = function(queryString, yield){
    var query = { method: 'GET',
                  headers:{ 'Accept':'application/json' },
                  isArray: true
                };
    var Query = $resource( '/salesforce/query', {}, {query: query} );
    return Query.query( {"query" : queryString }, function(res){
      yield(res);
    });
  }

  return this;
}]);
