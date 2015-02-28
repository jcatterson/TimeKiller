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

  CodeMirror.registerHelper("hint", "soql", function(editor, options) {
    var helper = new soqlHelper( editor, options );
    return helper.help();
  });

});

function soqlHelper( editor, options ){
    var Pos = CodeMirror.Pos;
    window.x = editor;
    var WORD = /[\w$]+/, RANGE = 500;

    this.help = function(){
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

      var context = findContext( editor );
      var tableNames = _.pluck(tables, "tableName");
      var matchingTableNames = [];
      if( foundWord.word ){
        matchingTableNames = _.filter( tableNames, function( tableName ){
          return tableName.toUpperCase().indexOf(foundWord.word.toUpperCase()) == 0;
        });
      }
      var result = { list: matchingTableNames };
      result =_.merge( result, foundWord );
      return result;
    }

    function findEndOfWord( editor, options ){
      var cur = editor.getCursor();
      var line = editor.getLine( cur.line );
      var index = cur.ch;
      while( index && line[index] && (line[index] != " " && line[index] != "\n") ) index++;
      return index--;
    }

    function findWord( editor, options ){
      var word = options && options.word || WORD;
      var cur = editor.getCursor();
      var curLine = editor.getLine(cur.line);
      var end = cur.ch;
      var start = end;
      while (start && word.test(curLine.charAt(start - 1))) --start;
      var curWord = start != end && curLine.slice(start, end);
      var diff = end - findEndOfWord( editor, options );

      return { from: CodeMirror.Pos(cur.line, start ),
               to: CodeMirror.Pos(cur.line, end - diff),
               word: curWord
             };
    }

    function findContext( editor, options ){
      var findNearestSelect = '';
      var findNearestFrom = '';
      searchFrom( editor );
      searchSelect( editor );
    }

    /*
    * Finds the nearest "from" clause to the right
    */
    function searchFrom( editor, startingPos ){
      if( !startingPos ){
          var cur = editor.getCursor();
          var curLine = editor.getLine(cur.line);
          var lineNum = cur.line;
          var end = cur.ch;
          startingPos = Pos(lineNum,end);
      }

      editor.moveH(1, "group");
      var word = findWord( editor );
      if( word ){
        if( word.word.toUpperCase() == "FROM" ){
            var pos = Pos( editor.getCursor().line, editor.getCursor().ch );
            editor.setCursor( startingPos );
            return pos;
        }
        else{
          var currentEditPos = editor.getCursor();
          var lastChar = editor.getLine( editor.lineCount() - 1 );
          lastChar = lastChar.length - 1;
          if( currentEditPos.line >= editor.lineCount()-1 && currentEditPos.ch >= lastChar ){
            editor.setCursor( startingPos );
            return;
          }
          return searchFrom( editor, startingPos );
        }
      }
    }

    /*
    * Finds the nearest "select" clause to the left
    */
    function searchSelect( editor, startingPos ){
      if( !startingPos ){
          var cur = editor.getCursor();
          x = 0;
          var curLine = editor.getLine(cur.line);
          var lineNum = cur.line;
          var end = cur.ch;
          startingPos = Pos(lineNum,end);
      }

      editor.moveH(-1, "group");
      var word = findWord( editor );

      if( word ){
        if( word.word && word.word.toUpperCase() == "SELECT" ){
            var pos = Pos( editor.getCursor().line, editor.getCursor().ch );
            editor.setCursor( startingPos );
            return pos;
        }
        else{
          var currentEditPos = editor.getCursor();
          var lastChar = editor.getLine( editor.lineCount() - 1 );
          lastChar = lastChar.length - 1;
          if( 0 <= editor.getCursor().line && 0 <= editor.getCursor().ch ){
            editor.setCursor( startingPos );
            return;
          }
          return searchSelect( editor, startingPos );
        }
      }
      return;
    }
}
