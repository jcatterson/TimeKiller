describe("soql-hint", function() {
  var cm, helper;

  beforeEach(function(){
      cm = new CodeMirror();
      helper = new soqlHelper( cm );
  });

  describe("eat whitespace", function(){
    it("eat white space", function(){
      var text = "HELLO";
      var fullText = text + "          ";
      cm.setValue( fullText );
      cm.setCursor( 0, fullText.length );
      helper.eatWhiteSpace( cm );
      expect( cm.getCursor() ).toEqual( CodeMirror.Pos(0, text.length) );
    });

    it("do nothing when no whitespace", function(){
      var text = "HELLO";
      cm.setValue( text );
      cm.setCursor( 0, text.length );
      helper.eatWhiteSpace();
      expect( cm.getCursor() ).toEqual( CodeMirror.Pos(0, text.length) );
    });

    it("do nothing when empty string", function(){
      cm.setValue("");
      helper.eatWhiteSpace();
      expect( 1 ).toEqual( 1 );
    });
  });

  describe(".findWord",function(){
    it("expect the characters seen to be shown", function(){
      var partFound = "SELE";
      var text = partFound + "CT";
      cm.setValue(text);
      cm.setCursor( CodeMirror.Pos(0, partFound.length) );
      var actual = helper.findWord();
      expect( actual.word ).toEqual( partFound );
    });

    it( "expect single characters to be shown", function(){
      var text = "S";
      cm.setValue(text);
      cm.setCursor( CodeMirror.Pos(0, text.length) );
      var actual = helper.findWord();
      expect( actual.word ).toEqual( text );
    });
  });

  describe( ".searchPreviousKeyword", function(){
    it("find \"FROM\"", function(){
      var text = "SELECT ID FROM ";
      cm.setValue( text );
      cm.setCursor( 0, text.length );
      var keyword = helper.searchPreviousKeyword();
      expect( keyword.keyword ).toEqual( "FROM" );
    });

    it("find \"SELECT\"", function(){
      var text = "SELECT ID";
      cm.setValue( text );
      cm.setCursor( 0, text.length );
      var keyword = helper.searchPreviousKeyword();
      expect( keyword.keyword ).toEqual( "SELECT" );
    });
  });

  describe(".help", function(){
      it("expect no results when empty",function(){
          var res = helper.help( cm );
          expect( res.list.length ).toEqual( 0 );
      });

      it("expect table options to display when after a FROM clause ", function(){
          var text = "SELECT ID FROM ";
          cm.setValue( text );
          cm.setCursor( CodeMirror.Pos( 0, text.length) );
          var res = helper.help( cm ).list;
          expect( res ).toEqual(['Account', 'Opportunity']);
      });

      it("expect column options to display", function(){
          var firstPart = "test SELECT ID";
          var secondPart = " FROM OPPORTUNITY"
          var text = firstPart + secondPart;
          cm.setValue( text );
          cm.setCursor( CodeMirror.Pos( 0, firstPart.length ) );
          var res = helper.help( cm ).list;
          expect( res ).toEqual(["Id", "StageName", "Name"]);
      });
  });
});