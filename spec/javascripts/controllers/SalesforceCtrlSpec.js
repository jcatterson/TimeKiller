describe("SalesforceCtrl", function() {
  var scope, httpBackend;
  var sObjectList = ["Account"];
  beforeEach(module('app'));

  describe("#new", function(){
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

    it("expect sobject list to be populated", function(){
      expect( scope.sobjects.length ).toEqual( sObjectList.length );
    });

  });

});

