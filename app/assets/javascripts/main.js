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
.directive('uiCodeMirror', [
  function(){
    return {
      restrict: "A",
      link: function( scope, element, attrs ){
        CodeMirror.commands.autocomplete = function(cm){
          var tbls = JSON.parse( attrs.tables );
          cm.showHint({
                        hint: CodeMirror.hint.soql,
                        options: { tables : tbls }
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