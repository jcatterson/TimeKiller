describe("sObject", function() {
  var sObjectHash;
  var sObj;
  var DEFAULT_COLUMNS_ON_SOBJ = 3;
  var ACCOUNT_FIELD = "AccountNumber";
  var ACCOUNT_FIELD_VALUE = "CC978213";

  beforeEach(function(){
    sObjectHash = {
      "attributes":{
        "type":"Account"
      },
      "Id":"001j000000G9Rq5AAF",
    };
    sObjectHash[ACCOUNT_FIELD] = ACCOUNT_FIELD_VALUE;
    sObj = new sObject(sObjectHash);
  });

  describe("#new", function(){
    it("hash to be populated", function(){
      expect(sObj.hash).toEqual( sObjectHash );
    });
  });

  describe(".listColumnNames", function(){
    it("expect all the cols to be displayed", function(){
      expect(sObj.listColumnNames().length).toEqual( DEFAULT_COLUMNS_ON_SOBJ );
    });

    it("expect to be lazy loaded", function(){
      expect( sObj.listColumnNames().length ).toEqual( DEFAULT_COLUMNS_ON_SOBJ );
      sObj.hash["additionalParameter"] = "no, dont add it";
      expect( sObj.listColumnNames().length ).toEqual( DEFAULT_COLUMNS_ON_SOBJ );
    });
  });

  describe(".getFieldValue", function(){
    it("expect to display the field value", function(){
      expect(sObj.getFieldValue(ACCOUNT_FIELD)).toEqual(ACCOUNT_FIELD_VALUE);
    });
    it("expect case insensitive", function(){
      expect(sObj.getFieldValue(ACCOUNT_FIELD.toUpperCase())).toEqual(ACCOUNT_FIELD_VALUE);
    });
    it("expect non-existing to return blank", function(){
      expect(sObj.getFieldValue("nonExistingField")).toEqual("");
    });
  });
});