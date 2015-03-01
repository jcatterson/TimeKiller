describe("soql-hint", function() {
  var cm, helper;

  beforeEach(function(){
      cm = new CodeMirror();
      helper = new soqlHelper( cm );
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
  });
});