// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../../mode/sql/sql"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../../mode/sql/sql"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  var Pos = CodeMirror.Pos;
  var WORD = /[\w$]+/, RANGE = 500;

  CodeMirror.registerHelper("hint", "soql", function(editor, options) {
    var tables = [
       {
         tableName : "Account",
         columns : ["Id", "AccountNumber", "ShippingCity"]
       },
       {
         tableName : "Opportunity",
         columns : ["Id", "StageName", "Name"]
       }
    ];
    var foundWord = findWord( editor, options );
    var tableNames = _.pluck(tables, "tableName");
    var matchingTableNames = _.filter( tableNames, function( tableName ){
      return tableName.toUpperCase().indexOf(foundWord.word.toUpperCase()) == 0;
    });
    var result = { list: matchingTableNames };
    result =_.merge( result, foundWord );
    return result;
  });

  function findWord( editor, options ){
    var word = options && options.word || WORD;
    var cur = editor.getCursor();
    var curLine = editor.getLine(cur.line);
    var end = cur.ch;
    var start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);
    return { from: Pos(cur.line, start),
             to: Pos(cur.line, end),
             word: curWord
           };
  }
});
