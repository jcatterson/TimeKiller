/*table
tr - rowspan
td - colspan
th - colspan
*/
function sObjectTable( queryString, sObjects ){
    this.cellValues;
    this.queryString = queryString;

    this.createHeaders = function(){
        var headerRow = [];
        var cols = this.queryString['SELECT'];
        for( var j = 0; j < cols.length; j++ ){
            var col = cols[j];
            if( col.name ){
                headerRow.push( col.name );
            }
            else{
                var table = new sObjectTable( col, sObjects );
                headerRow.push( {tableName: col["FROM"][0].table,
                            headers: table.createHeaders()
                            });
            }
        }
        return headerRow;
    }

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
            if( _.isObject( header ) ){
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
        if( actualHeaders[0].length != standardHeaders.length ){// We have duplicates
            for( var i = 0; i < standardHeaders.length; i++ ){
                var header = standardHeaders[i];
                header.rowSpan = 2;
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
}
