describe("sObjectTable", function() {
    var table, query;
    beforeEach(function(){
        var innerQuery = 'Select Id,StageName from Opportunities';
        innerQuery = simpleSqlParser.sql2ast( innerQuery.toUpperCase() );
        query = "Select Id FROM Account".toUpperCase();
        query = simpleSqlParser.sql2ast( query );
        query['SELECT'].push( innerQuery );
        table = new sObjectTable( query, [] );
    });

    describe(".createHeaders", function(){
        it("expect the number of columns to be the same as the main query", function(){
            var headersLength = table.createHeaders().length;
            expect( query["SELECT"].length ).toEqual( headersLength );
            expect( 1 ).not.toBe( headersLength );
        });

        it("expect the second object to be an inner query; therefore an object", function(){
            var headers = table.createHeaders();
            expect( 2 ).toEqual( headers[1].headers.length );
            expect( "OPPORTUNITIES" ).toEqual( headers[1].tableName );
        });
    });
});