var AccountTest = {
  jsonWithOpportunities : function(){
      return {
        "attributes":{
          "type":"Account"
        },
        "Id":"001j000000G9Rq5AAF",
        "Opportunities":[
          {
            "attributes":{
              "type":"Opportunity"
            },
            "StageName":"Closed Won",
            "Id":"006V0000005Gm8a"
          },
          {
            "attributes":{
              "type":"Opportunity"
            },
            "StageName":"Open",
            "Id":"006V0000005Gm8b"
          }
        ],
        "Owner":{
          "attributes":{
            "type": "Contact"
          },
          "Name": "Justin Catterson"
        }
      };
  }
}