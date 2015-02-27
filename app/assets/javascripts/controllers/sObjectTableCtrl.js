app.controller("SObjectTableCtrl", ['$scope', "$resource", function($scope, $resource){
    $scope.init = function( query, sObjects ){
        var table = new sObjectTable( query, sObjects );
        $scope.headers = table.getHeaders();
        $scope.rows = [];
        for( var i = 0; i < sObjects.length; i++ ){
            var rowData = table.getRow(i);
            $scope.rows = $scope.rows.concat( rowData );
        }
    }
}])