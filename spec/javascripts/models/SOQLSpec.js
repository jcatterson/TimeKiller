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

        describe(".tableName", function(){
            it("expect the from clause name", function(){
                expect( soql.tableName() ).toEqual("ACCOUNT")
            });
        });
    });

    describe("with inner query", function(){
        var queryString = "Select Id, (Select Id from Opportunities) from Account";
        var soql;
        beforeEach( function(){
            soql = new SOQL( queryString );
        });

        describe( ".columns", function(){
            it("display inner query as a single column", function(){
                expect( soql.columns()[1].tableName() ).toEqual( "OPPORTUNITIES" );
            });
        });

        describe( ".dataColumns", function(){
            it("display all columns that can retrive data on a sObject", function(){
                expect( soql.dataColumns() ).toEqual(["ID", "OPPORTUNITIES.ID"]);
            });
        });
    });

    describe( "aggregate query as aliased name", function(){
        var queryString = "Select count(ID) test from Account";
        var soql;
        beforeEach( function(){
            soql = new SOQL( queryString );
        });

        it( "the ailiased name is a data column", function(){
            expect( soql.dataColumns() ).toEqual( ["TEST"] );
        });
    });

    describe( "aggregate query without ailias", function(){
        var queryString = "Select Min(CreatedDate), MAX(AccountNumber) from Account";
        var soql;
        beforeEach( function(){
            soql = new SOQL( queryString );
        });

        it( "non-ailiased aggregate columns shall be named \"EXPRn\"", function(){
            expect( soql.dataColumns() ).toEqual( ["EXPR0", "EXPR1"] );
        });
    });
});