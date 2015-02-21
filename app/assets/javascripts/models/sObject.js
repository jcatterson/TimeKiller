sObject = function( sobjectHash ){
  this.hash = sobjectHash;

  this.listColumnNames = function(){
    var colNames = [];
    for( var col in this.hash ){
      colNames.push( col );
    }
    return colNames;
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
      currentObject = currentObject.hash[ cols[index] ];

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

createSObjects = function( sobjectsHash ){
  var sObjects = [];
  for( var i = 0; i < sobjectsHash.length; i++ ){
    sObjects.push( new sObject( sobjectsHash[i] ) );
  }
  return sObjects;
}
