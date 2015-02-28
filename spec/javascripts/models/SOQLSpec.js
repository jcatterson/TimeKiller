describe("soql", function() {
    describe("standard query", function(){
        var queryString = "Select Id from Account";
        var soql;
        beforeEach( function(){
            soql = new SOQL( queryString );
        });
        
        describe(".columns", function(){
            it( "shows all columns from query", function(){
                expect( soql.columns()[0].name ).toEqual( "ID" );
                expect( soql.columns().length ).toEqual( 1 );
            });
        });
    });
});