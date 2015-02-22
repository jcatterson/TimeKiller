describe("SalesforceCtrl", function() {
  var scope, httpBackend;
  var sObjectList = ["Account"];
  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend ){
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    httpBackend.expectGET( "/salesforce/sobject_list" ).respond( sObjectList );
    createController = function(){
      return $controller('SalesforceCtrl', { $scope: scope });
    }
    createController();
    httpBackend.flush();
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe("#new", function(){
    it("expect sobject list to be populated", function(){
      expect( scope.sobjects.length ).toEqual( sObjectList.length );
    });
  });

  describe(".sobjects_like", function(){
    var NON_MATCHING = "reallyUniqueNoMatchingsObjectListItems";

    it("expect searching to include objects with similar names",function(){
      scope.sobject_search = sObjectList[0].toLowerCase().substr(1, sObjectList.length - 2);
      scope.sobjects_like();
      expect( scope.sobjects.length ).toEqual( sObjectList.length );
    });

    it("expect to exclude objects with non-similar names", function(){
      scope.sobject_search = NON_MATCHING;
      scope.sobjects_like();
      expect( scope.sobjects.length ).toEqual( 0 );
    });

    it("expect to be able to get back to the original list", function(){
      var originalLength = scope.sobjects.length;
      scope.sobject_search = NON_MATCHING;
      scope.sobjects_like();
      scope.sobject_search = "";
      scope.sobjects_like();
      expect( scope.sobjects.length ).toEqual( originalLength );
    });
  });

  describe(".query", function(){
    var queryResults, innerQuery;
    beforeEach( inject( function($compile){
      var element = '<textarea ui-code-mirror="true"></textarea>';
      element = $compile(element)(scope);
      scope.$digest();
      queryResults = [{
                        "attributes":{
                          "type":"Account"
                        },
                        "Id":"001j000000G9Rq5AAF"
                      },
                      {
                        "attributes":{
                          "type":"Account"
                        },
                        "Id":"001j000000G9Rq5AAG"
                      }];
      var regExpression = new RegExp( "[salesforce/query?query=].*" );

      httpBackend.expectGET(regExpression).respond( queryResults );
      innerQuery = "Select Id from Opportunities".toUpperCase();
      scope.codeWindow.setValue("Select Id, (" + innerQuery + ") from Account");
      scope.query();
      httpBackend.flush();
    }));

    it("Displays query results in \"sobjects\" ", function(){
      var sobjects = createSObjects( queryResults, {} );
      expect( JSON.stringify(scope.query_results["sobjects"]) ).toEqual( JSON.stringify(sobjects) );
    });

    it("Displays the columns queried for", function(){
      var columns = scope.query_results["queryString"]["SELECT"];
      expect( columns[0].name ).toEqual("ID");
      innerQuery = simpleSqlParser.sql2ast( innerQuery );
      expect( JSON.stringify(columns[1]) ).toEqual( JSON.stringify(innerQuery) );
    });
  });
});
