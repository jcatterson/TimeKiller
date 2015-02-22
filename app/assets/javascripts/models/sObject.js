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
    var tableName = [];
    if( column.isSubQuery ){
      tableName.push( column.parentName );
    }
    var fieldLookups = tableName.concat( column.name.toUpperCase().split('.') );
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
      else if( currentObject.constructor === Array ){
        var values = [];
        for( var x = 0; x < currentObject.length; x++ ){
          column.isSubQuery = false;
          values.push( new sObject( currentObject[x], this.metadatas ).getFieldValue( column ) );
        }
        return values;
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
