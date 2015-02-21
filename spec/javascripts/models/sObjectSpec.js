describe("sObject", function() {
  describe("#new", function(){
    var sObjectHash = {};
    var sObj;

    beforeEach(function(){
      sObjectHash = {
        "attributes":{
          "type":"Account"
        }
      };
      sObj = new sObject(sObjectHash);
    });

    it("hash to be populated", function(){
      expect(sObj.hash).toEqual( sObjectHash );
    });
  });
});