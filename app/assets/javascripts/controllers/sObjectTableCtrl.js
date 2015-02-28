app.controller("SObjectTableCtrl", ['$scope', "$resource", function($scope, $resource){
    $scope.displayResults = function(){
        try{
            obj = $scope.sObjects;
            var table = new sObjectTable( $scope.queryInfo, $scope.sObjects );
            $scope.headers = table.getHeaders();
            $scope.rows = [];
            for( var i = 0; i < $scope.sObjects.length; i++ ){
                var rowData = table.getRow(i);
                $scope.rows = $scope.rows.concat( rowData );
            }
        }
        catch(err){
            console.log( err );
        }
    }

    $scope.$watch( 'queryInfo', function(){
        if( $scope.sObjects ){
            $scope.displayResults();
        }
    });

    $scope.$watch( 'sObjects', function(){
        if( $scope.queryInfo ){
            $scope.displayResults();
        }
    });
}])