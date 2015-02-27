app.controller("SObjectTableCtrl", ['$scope', "$resource", function($scope, $resource){
    $scope.init = function( query, sObjects ){
        console.log( "Finally" );
        console.log( query );
        console.log( sObjects );
        window.x = query;
        //$scope.query = query;
        //var table = new sObjectTable( query, sObjects );
        //$scope.test = "hello from the controller";
    }
}])