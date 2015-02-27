describe("sObjectTable", function() {
    var table, query, innerQuery;
    var results;
    beforeEach(function(){
        innerQuery = 'Select Id,StageName from Opportunities';
        innerQuery = simpleSqlParser.sql2ast( innerQuery.toUpperCase() );
        query = "Select Id FROM Account".toUpperCase();
        query = simpleSqlParser.sql2ast( query );
        query['SELECT'].push( innerQuery );
        results = [ new sObject( AccountTest.jsonWithOpportunities() ) ]
        table = new sObjectTable( query, results );
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

    describe(".getHeaders", function(){
        it("when inner queries exist, standard rows to have a rowspan of 2 ", function(){
            var headers = table.getHeaders();
            expect(2).toEqual( headers[0][0].rowSpan );
        });
        it("when inner queries exist, inner query rows to have a rowspan of 1", function(){
            var headers = table.getHeaders();
            expect(1).toEqual( headers[0][1].rowSpan );
        });
        it("when inner queries to have a colSpan the same length as the fields in the query", function(){
            var headers = table.getHeaders();
            expect( innerQuery["SELECT"].length ).toEqual( headers[0][1].colSpan );
        });
    });
});