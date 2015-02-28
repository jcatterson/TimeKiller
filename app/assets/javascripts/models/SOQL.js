SOQL = function( queryString ){

    function readSOQL( theQueryString ){
        var queryString = simpleSqlParser.sql2ast( theQueryString.toUpperCase() );
        var columns = queryString["SELECT"];
        for( var i = 0; i < columns.length; i++ ){
          var col = columns[i].name;
          if( col.indexOf("(") == 0 && col.lastIndexOf(")") == col.length - 1){
            var innerQuery = col.substring(1, col.length-1);
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
      for( var i = 0; i < this.columns().length; i++ ){
        var col = this.columns()[i];
        if( col.name ){
          cols.push( col.name );
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