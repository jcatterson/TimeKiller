SOQL = function( queryString ){

    function readSOQL( theQueryString ){
        var queryString = simpleSqlParser.sql2ast( theQueryString.toUpperCase() );
        var columns = queryString["SELECT"];
        for( var i = 0; i < columns.length; i++ ){
          var col = columns[i].name;
          if( col.indexOf("(") == 0 && col.lastIndexOf(")") == col.length - 1){
            var innerQuery = col.substring(1, col.length - 1);
            columns[i] = new SOQL( innerQuery );
          }
        }
        return queryString;
    }

    this.columns = function(){
      return this.query["SELECT"];
    }

    this.dataColumns = function(){
      var cols = [];
      var numAiliases = 0;
      for( var i = 0; i < this.columns().length; i++ ){
        var col = this.columns()[i];
        var colName = col.name;
        if( colName ){
          var aggregateMatch = /([(][ ]*[A-Za-z_0-9]+[ ]*[)])[ ]*([A-Za-z0-9]*)/;
          if( aggregateMatch.test( colName ) ){
            var matches = aggregateMatch.exec( colName );
            if( matches.length == 3 && matches[2] != "" ){// We have an ailias
              colName = matches[2];
            }
            else{// we have an aggregate without an ailias
              colName = 'EXPR' + numAiliases;
              numAiliases++;
            }
          }
          cols.push( colName );
        }
        else{
          var subCols = col.dataColumns();
          subCols = _.map( subCols, function( colName ){ return col.tableName() + '.' + colName } );
          cols = cols.concat( subCols );
        }
      }
      return cols;
    }

    this.tableName = function(){
      return this.query["FROM"][0].table
    }

    this.string = queryString;
    this.query = readSOQL( queryString );
}