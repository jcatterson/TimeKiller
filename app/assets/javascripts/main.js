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
        var tables = []
        jc_SFDC.listsObjects( function(res){
          tables = res;
        });
        CodeMirror.commands.autocomplete = function(cm){
          cm.showHint({
                        hint: CodeMirror.hint.soql,
                        options: { tables : tables, jc_SFDC : jc_SFDC }
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
.service("jc_SFDC", ["$resource", function jc_SFDC($resource){
  var sObjects = {}

  this.listsObjects = function( yield ){
    if( this.sObjectList ) return this.sObjectList;

    var query = { method: 'GET',
                  headers:{ 'Accept':'application/json' },
                  isArray: true
                };
    var Salesforce = $resource( '/salesforce/sobject_list', {}, {query: query} );
    var self = this;
    return Salesforce.query( function(result){
      self.sObjectList = result;
      if( yield )
        yield( result );
    });
  }

  this.describe = function(sObjectToDescribe, yield){
    if( this.alreadyDescribed[sObjectToDescribe] ){
      yield( this.alreadyDescribed[sObjectToDescribe] );
      return this.alreadyDescribed[sObjectToDescribe];
    }
    var describe = { method: 'GET',
                     headers:{ 'Accept':'application/json' },
                     isArray: false
                };
    var Describe = $resource( '/salesforce/describe', {}, {query: describe} );
    var myDescribe = this.alreadyDescribed;
    return Describe.query( {"sobject":sObjectToDescribe}, function(res){
      myDescribe[sObjectToDescribe] = res.sobject;
      if( yield )
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
      if( yield )
        yield(res);
    });
  }

  this.alreadyDescribed = {};

  return this;
}]);
