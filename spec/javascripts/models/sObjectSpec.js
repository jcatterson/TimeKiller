describe("sObject", function() {
  var sObjectHash;
  var sObj;
  var DEFAULT_COLUMNS_ON_SOBJ = 5;
  var ACCOUNT_FIELD = {
    name:"ACCOUNTNUMBER",
  };
  var ACCOUNT_FIELD_VALUE = "CC978213";

  beforeEach(function(){
    sObjectHash = {
      "attributes":{
        "type":"Account"
      },
      "Id":"001j000000G9Rq5AAF",
      "Opportunities":[
        {
          "attributes":{
            "type":"Opportunity"
          },
          "StageName":"Closed Won"
        },
        {
          "attributes":{
            "type":"Opportunity"
          },
          "StageName":"Open"
        }
      ],
      "Owner":{
        "attributes":{
          "type": "Contact"
        },
        "Name": "Justin Catterson"
      }
    };
    sObjectHash[ACCOUNT_FIELD.name] = ACCOUNT_FIELD_VALUE;
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
      ACCOUNT_FIELD.name = ACCOUNT_FIELD.name.toLowerCase();
      expect(sObj.getFieldValue(ACCOUNT_FIELD)).toEqual(ACCOUNT_FIELD_VALUE);
    });
    it("expect non-existing to return blank", function(){
      ACCOUNT_FIELD.name = 'garbage';
      expect(sObj.getFieldValue(ACCOUNT_FIELD)).toEqual("");
    });
    it( "expect children fields to be found", function(){
      var opportunityField = {
        name:"OPPORTUNITIES.STAGENAME",
      };
      expect( sObj.getFieldValue(opportunityField) ).toEqual( ["Closed Won", "Open"] );
    });
    it( "expect parent fields to be found", function(){
      var parentField = {
        name: "Owner.Name",
      };
      expect( sObj.getFieldValue( parentField ) ).toEqual("Justin Catterson");
    });
  });
});