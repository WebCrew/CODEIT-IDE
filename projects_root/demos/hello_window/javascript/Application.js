
var GLOBAL_MOUSE_LISTENER;
var APP;

			
function init()
{
	GLOBAL_MOUSE_LISTENER = new CODEIT_GlobalMouseListener();
	APP = new Application();
}



window.addEventListener("load", init, false);







function Application( )
{						
	this.messageWin = new CODEIT_Window( HTML('MESSAGE_WIN') );
  	
  	HTML('WIN_MESSAGE_CONTENT').innerHTML = 'loading...';
  	this.messageWin.open(true);
  
  	SendAndLoad( 'data/text.html' , null , Bind( this , this.onLoadData)  );
  	
	
}


Application.prototype.onLoadData = function (  _e  )
{
    HTML('WIN_MESSAGE_CONTENT').innerHTML = _e.target.responseText;
}




