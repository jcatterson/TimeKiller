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
    var WORD = /[\w$]+/, RANGE = 500;
    this.editor = editor;
    this.options = options;

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

      var foundWord = this.findWord();
      var matchingTableNames = [];

      if( this.editor.getValue() != "" )
      {
        var context = this.findContext();

        if( context ){
          if( context.keyword == "FROM" ){
            var tableNames = _.pluck(tables, "tableName");
            matchingTableNames = _.filter( tableNames, function( tableName ){
              return tableName.toUpperCase().indexOf(foundWord.word.toUpperCase()) == 0;
            });
          }
        }

      }

      result = { list: matchingTableNames };
      result =_.merge( result, foundWord );
      return result;
    }

    this.findEndOfWord = function(){
      var cur = this.editor.getCursor();
      var line = this.editor.getLine( cur.line );
      var index = cur.ch;
      while( index && line[index] && (line[index] != " " && line[index] != "\n") ) index++;
      return index--;
    }

    this.findWord = function(){
      var word = options && options.word || WORD;
      var cur = this.editor.getCursor();
      var curLine = this.editor.getLine(cur.line);
      var end = cur.ch;
      var start = end;
      while (start && word.test(curLine.charAt(start - 1))) --start;
      var curWord = curLine.slice(start, end);
      var diff = end - findEndOfWord();

      return { from: CodeMirror.Pos(cur.line, start ),
               to: CodeMirror.Pos(cur.line, end - diff),
               word: curWord
             };
      }

    this.findContext = function(){
      var keyword = this.searchPreviousKeyword();
      return keyword;
    }

    /*
    * Finds the nearest keyword to the left
    */
    this.searchPreviousKeyword = function(startingPos){
      var keywords = ['SELECT', 'FROM'];

      if( !startingPos ){
          var cur = this.editor.getCursor();
          var curLine = this.editor.getLine(cur.line);
          var lineNum = cur.line;
          var end = cur.ch;
          startingPos = Pos(lineNum,end);
          eatWhiteSpace( this.editor );
      }

      var word = this.findWord();

      if( word ){
        if( word.word && _.includes( keywords, word.word.toUpperCase() ) ){
            var keyword = word.word.toUpperCase();
            var pos = Pos( this.editor.getCursor().line, this.editor.getCursor().ch );
            this.editor.setCursor( startingPos );
            return {
              pos: pos,
              keyword: keyword
            }
        }
        else{
          var currentEditPos = this.editor.getCursor();
          console.log( "how many times?" );
          if( 0 == this.editor.getCursor().line && 0 == this.editor.getCursor().ch ){
            this.editor.setCursor( startingPos );
            console.log( "We read to the beginning");
            return;
          }

          //this.editor.moveH(-1, "group");
          //eatWhiteSpace( this.editor );
          return this.searchPreviousKeyword( startingPos );
        }
      }
      return;
    }

    this.eatWhiteSpace = function(){
      var cur = this.editor.getCursor();
      var lineNum = cur.line;
      var ch = cur.ch;
      var line = this.editor.getLine( lineNum );
      while( (line.length - 1) < ch || (line[ch] == " " && ch) ) {
        ch--;
      }
      ch++;
      var pos = CodeMirror.Pos( lineNum, ch );
      this.editor.setCursor( pos );
    }
}
