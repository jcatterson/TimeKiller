describe("sObjectTable", function() {
    var table, query;
    beforeEach(function(){
        query = "Select Id, (Select Id,StageName from Account) FROM Account".toUpperCase();
        query = simpleSqlParser.sql2ast( query );
        table = new sObjectTable( query, [] );
    });
    
    describe(".createHeaders", function(){
        it("expect the number of columns to be the same as the main query", function(){
            var headersLength = table.createHeaders().length;
            expect( query["SELECT"].length ).toEqual( headersLength );
            expect( 0 ).not.toBe( headersLength );
        });
    });
});