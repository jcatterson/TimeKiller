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
      console.log( "The column is a sub query " );
      tableName.push( column.parentName );
    }
    var fieldLookups = tableName.concat( column.name.toUpperCase().split('.') );
    var currentObject = this;
    for( var i in fieldLookups ){
      var field = fieldLookups[i];

      var cols = currentObject.listColumnNames();
      console.log( "Field" + field );
      console.log( "What are my cols?" + cols );
      var index = _.findIndex( cols, function(col){
                    return col.toUpperCase() == field;
                  });
      var colName = cols[index];
      console.log( "What is the cols name?" + colName );
      console.log( colName );
      currentObject = currentObject.hash[ colName ];
      console.log( "What is my curentObject" );
      console.log( currentObject );
      if( !currentObject ){
        currentObject = '';
        break;
      }
      else if( currentObject.constructor === Array ){
        var values = [];
        console.log("Current Object: " );
        console.log( currentObject );
        for( var x = 0; x < currentObject.length; x++ ){
          alert( "We changed it!");
          column.isSubQuery = false;
          var childRec = new sObject( currentObject[x], this.metadatas );
          var answers = childRec.getFieldValue( column );
          values.push( answers );
        }
        console.log("What are my values?" + values );
        return values;
      }
      else if( typeof currentObject === 'object' ){
        console.log( "We are an sObject ");
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
