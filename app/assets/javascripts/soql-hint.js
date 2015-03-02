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
    var helper = new soqlHelper( editor, options.options );
    return helper.help();
  });

});

function soqlHelper( editor, options ){
    var Pos = CodeMirror.Pos;
    var WORD = /[\w$]+/, RANGE = 500;
    this.editor = editor;
    this.options = options;
    this.tables = options.tables;

    this.help = function(){

      var foundWord = this.findWord();
      var matchingResults = [];

      if( this.editor.getValue() != "" )
      {
        var context = this.findContext();

        if( context ){
          if( context.keyword == "FROM" ){
            matchingResults = this.findMatchingTables( foundWord );
          }
          else if( context.keyword == "SELECT" ){
            matchingResults = this.findMatchingColumns( foundWord );
          }
        }

      }

      result = { list: matchingResults };
      result =_.merge( result, foundWord );
      return result;
    }

    this.findMatchingColumns = function( foundWord ){
      var pos = this.editor.getCursor();
      var key = this.searchWord( 1 );
      this.editor.getCursor( key.pos );
      this.editor.moveH(1, "word");
      this.editor.moveH(1, "word");
      var word = this.findWord();
      this.editor.setCursor( pos );
      var tableName = word.fullWord;
      var tbl = _.find( this.tables, function(tbl){
        return tbl.tableName.toUpperCase() == tableName.toUpperCase();
      });
      return tbl.columns;
    }

    this.findMatchingTables = function( foundWord ){
      var tableNames = _.pluck(this.tables, "tableName");
      var matchingTableNames = _.filter( tableNames, function( tableName ){
        return tableName.toUpperCase().indexOf(foundWord.word.toUpperCase()) == 0;
      });

      return matchingTableNames;
    }

    this.findEndOfWord = function(){
      var cur = this.editor.getCursor();
      var line = this.editor.getLine( cur.line );
      var index = cur.ch;
      while( index && line[index] && (line[index] != " " && line[index] != "\n") ) index++;
      return index--;
    }

    this.findWord = function(){
      var word = this.options && this.options.word || WORD;
      var cur = this.editor.getCursor();
      var curLine = this.editor.getLine(cur.line);
      var end = cur.ch;
      var start = end;
      while (start && word.test(curLine.charAt(start - 1))) --start;
      var curWord = curLine.slice(start, end);
      var diff = end - this.findEndOfWord();
      var fullWord =
      this.editor.getRange({
                                            line: cur.line,
                                            ch: start
                                          },
                                          {
                                            line: cur.line,
                                            ch: end - diff
                                          }
                                        );

      return { from: CodeMirror.Pos(cur.line, start ),
               to: CodeMirror.Pos(cur.line, end - diff),
               word: curWord,
               fullWord: fullWord
             };
      }

    this.findContext = function(){
      var keyword = this.searchWord( -1 );
      return keyword;
    }

    this.searchWord = function( direction, startingPos ){
      var keywords = ['SELECT', 'FROM'];

      if( !startingPos ){
          var cur = this.editor.getCursor();
          var curLine = this.editor.getLine(cur.line);
          var lineNum = cur.line;
          var end = cur.ch;
          startingPos = Pos(lineNum,end);
          this.eatWhiteSpace( this.editor );
      }
      var word = this.findWord();

      if( word && word.fullWord && _.includes( keywords, word.fullWord.toUpperCase() ) ){
          var keyword = word.fullWord.toUpperCase();
          var pos = Pos( this.editor.getCursor().line, this.editor.getCursor().ch );
          this.editor.setCursor( startingPos );
          return {
            pos: pos,
            keyword: keyword
          }
      }
      else{
        if( this.shouldQuitSearching( direction ) )
          return;

        var oldWord = this.findWord();
        this.editor.moveH(direction, "word");

        if( oldWord.fullWord == this.findWord().fullWord ){
          this.editor.moveH(direction, "word");
        }

        if( this.editor.getCursor().ch == 0 ){
          this.editor.moveH( 1, "char" );
        }
        return this.searchWord( direction, startingPos );
      }
    }

    this.shouldQuitSearching = function( direction ){
      if( direction > 0 ){
        var currentEditPos = this.editor.getCursor();
        var line = currentEditPos.line
        var strLen = this.editor.getLine(line).length;
        return strLen <= this.editor.getCursor().ch;
      }
      else{
        return 0 == this.editor.getCursor().line && 1 >= this.editor.getCursor().ch;
      }
    }

    this.eatWhiteSpace = function(){
      var cur = this.editor.getCursor();
      var lineNum = cur.line;
      var ch = cur.ch;
      var line = this.editor.getLine( lineNum );
      while( ch >= 0 && (line[ch] == " " || !line[ch] ) ){
        ch--;
      }
      ch++;
      var pos = CodeMirror.Pos( lineNum, ch );
      this.editor.setCursor( pos );
    }
}
