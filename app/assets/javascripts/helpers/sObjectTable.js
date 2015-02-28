function sObjectTable( queryString, sObjects ){
    this.queryString = queryString;
    this.sObjects = _.clone( sObjects );

    /*
    {
      headers: [
          "column",
          "columnB",
          {
            tableName: "TableB",
            headers: [
              ..
            ]
          },
          "columnC",
          ...
      ]
    }*/
    this.createHeaders = function(){
        var headerRow = [];
        var cols = this.queryString['SELECT'];
        for( var j = 0; j < cols.length; j++ ){
            var col = cols[j];
            if( col.name ){
                headerRow.push( col.name );
            }
            else{
                var table = new sObjectTable( col, this.sObjects );
                headerRow.push( {
                                  tableName: col["FROM"][0].table,
                                  headers: table.createHeaders()
                            });
            }
        }
        return headerRow;
    }

    /*[
        {
            rowSpan: n,
            colSpan: n,
            name: 'str',
            subHeaders: opt
                      [  {
                            tableName: "TableName"
                            headers: [
                                "column",
                                "columnB"
                            ]
                         }
                      ]
        },
        ...
    ]*/
    this.getHeaders = function(){
        var headers = this.createHeaders();
        var actualHeaders = [];
        actualHeaders.push( [] );
        var standardHeaders = [];
        var innerHeaders = [];
        for( var i = 0; i < headers.length; i++ ){
            var header = headers[i];
            var th = {
                rowSpan: 1,
            }
            if( header.tableName ){
                th.name = header.tableName;
                th.colSpan = header.headers.length;
                th.subHeaders = header.headers;
                innerHeaders.push( th );
            }
            else{
                th.name = header;
                th.colSpan = 1;
                standardHeaders.push( th );
            }
            actualHeaders[0].push( th );
        }

        if( actualHeaders[0].length != standardHeaders.length ){// We have subHeaders
            for( var i = 0; i < standardHeaders.length; i++ ){
                var header = standardHeaders[i];
                header.rowSpan = 2;// Only expect subHeaders to go one layer deep
            }
        }
        if( innerHeaders.length ){
            actualHeaders.push( [] );
        }
        for( var i = 0; i < innerHeaders.length; i++ ){
            var innerHeader = innerHeaders[i];
            for( var j = 0; j < innerHeader.subHeaders.length; j++ ){
                var innerHeaderColumn = innerHeader.subHeaders[j];
                var header = {
                    name: innerHeaderColumn,
                    colSpan: 1,
                    rowSpan: 1
                };
                actualHeaders[1].push( header );
            }
        }
        return actualHeaders;
    }

    /*
    [
      {
        col : [
                {
                  html : "innerHtmlB",
                  rowSpan : n
                }
        ]
      },
      {
        col : [
                {
                  html : "innerHtmlB",
                  rowSpan : n
                }
        ]
      }
    ]
    */
    this.getRow = function( index ){
        var data = this.getRowData( index );
        var maxLenCol = _.max( data, function(ary){
            if( _.isArray( ary ) ){
                return ary.length;
            }
            return 1;
        } );
        if( _.isArray( maxLenCol ) )
            maxLenCol = maxLenCol.length;
        else
            maxLenCol = 1;

        var htmlRows = [];
        for( var row = 0; row < maxLenCol; row++ ){
            var htmlRow = {
                col : []
            }
            htmlRows.push( htmlRow );
            for( var td = 0; td < data.length; td++ ){
                var columnsData = data[td];
                if( _.isArray( columnsData ) ){
                    htmlRow.col.push( {
                        html: columnsData[row],
                        rowSpan: 1
                    } );
                }
                else if( row == 0 ){
                    htmlRow.col.push( {
                        html: columnsData,
                        rowSpan: maxLenCol
                    } );
                }
            }
        }
        return htmlRows;
    }

    /*
    * returns the array for each column defined by the SOQLDataCols
    * the answers for all columns sObj.getFieldValue
    */
    this.getRowData = function( index ){
        var rows = [];
        var sObj = this.sObjects[index];
        var dataCols = getSOQLDataCols( this.queryString );
        for( var i = 0; i < dataCols.length; i++ ){
            rows.push( sObj.getFieldValue( dataCols[i] ) );
        }
        return rows;
    }

    /*
    * Returns the FieldReference name of all the columns based on the
    * mainQuery and the tableName
    */
    function getSOQLDataCols( mainQuery, tableName ){
        var cols = mainQuery["SELECT"];
        var dataCol = [];
        for( var i = 0; i < cols.length; i++ ){
            var col = cols[i];
            if( col.name ){
                if( tableName )
                    dataCol.push( tableName + '.' + col.name );
                else
                    dataCol.push( col.name );
            }
            else{
                var myCols = getSOQLDataCols( col, col["FROM"][0].table );
                dataCol = dataCol.concat( myCols );
            }
        }
        return dataCol;
    }
}