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
                headerRow.push( {table_name: col["SELECT"],
                            headers: table.createHeaders()
                            });
            }
        }
        return headerRow;
    }
}
