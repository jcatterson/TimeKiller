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
  });

  /*describe(".help", function(){
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
          console.log( text );
          cm.setValue( text );
          cm.setCursor( CodeMirror.Pos( 0, firstPart.length ) );
          console.log( "our test");
          var res = helper.help( cm ).list;
          console.log( "done");
          expect( res ).toEqual(["Id", "StageName", "Name"]);
      });
  });*/
});