sObject = function( sobjectHash, metadatas ){
  this.hash = sobjectHash;
  this.metadatas = metadatas;

  this.listColumnNames = function(){
    if( !this.cols ){
      this.cols = [];
      for( var col in this.hash ){
        this.cols.push( col );
      }
    }
    return this.cols;
  }

  this.getDescribe = function(){
    var objectType = this.hash.attributes.type;
    return this.metadatas[objectType];
  }

  this.getFieldValue = function( column ){
    var lookups = column.name.split('.');
    var columnToFind = lookups[0];
    var ourCols = this.listColumnNames();
    var index = _.findIndex( ourCols, function(ourCol){
      return ourCol.toUpperCase() == columnToFind.toUpperCase();
    });
    var matchingColName = ourCols[index];
    if( !matchingColName ){
      return "";
    }
    var colValue = this.hash[ matchingColName ];

    var deeperLookup = lookups.splice( 1, lookups.length );
    deeperLookup = deeperLookup.join('.');
    deeperLookup = {
      name:deeperLookup
    };

    if( colValue.constructor === Array ){
      var answers = [];
      for( var i = 0; i < colValue.length; i++){
        var sObj = colValue[i];
        sObj = new sObject( sObj );
        var ans = sObj.getFieldValue( deeperLookup );
        if( ans.constructor === Array ){
          answers.concat( ans );
        }
        else{
          answers.push( ans );
        }
      }
      return answers;
    }
    else if( typeof colValue === "object"){
      var lookupObject = new sObject( colValue );
      return lookupObject.getFieldValue( deeperLookup );
    }
    else{
      return colValue;
    }
  }
}

createSObjects = function( sobjectsHash, metadatas ){
  var sObjects = [];
  for( var i = 0; i < sobjectsHash.length; i++ ){
    sObjects.push( new sObject( sobjectsHash[i], metadatas ) );
  }
  return sObjects;
}
