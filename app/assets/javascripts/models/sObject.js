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

  this.getFieldValue = function( fieldName ){
    var fieldLookups = fieldName.toUpperCase().split('.');
    var currentObject = this;
    for( var i in fieldLookups ){
      var field = fieldLookups[i];
      var cols = currentObject.listColumnNames();
      var index = _.findIndex( cols, function(col){
                    return col.toUpperCase() == field;
                  });
      var colName = cols[index];
      currentObject = currentObject.hash[ colName ];

      if( !currentObject ){
        currentObject = '';
        break;
      }
      else if( typeof currentObject === 'object' ){
        currentObject = new sObject( currentObject );
      }
    }
    return currentObject;
  }
}

createSObjects = function( sobjectsHash, metadatas ){
  var sObjects = [];
  for( var i = 0; i < sobjectsHash.length; i++ ){
    sObjects.push( new sObject( sobjectsHash[i], metadatas ) );
  }
  return sObjects;
}
