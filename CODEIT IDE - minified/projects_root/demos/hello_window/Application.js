
var APP;
			
function init()
{
	APP = new Application();
}

window.addEventListener("load", init, false);





// application class

function Application( )
{						
	this.messageWin = new CODEIT_Window( HTML('MESSAGE_WIN') );
  	
  	HTML('WIN_MESSAGE_CONTENT').innerHTML = 'loading...';
  	this.messageWin.open(true);
  	
    // load the index file
  	SendAndLoad( 'data/text.html' , null , Bind( this , this.onLoadData)  );	
}


Application.prototype.onLoadData = function (  _e  )
{
  // place the loaded text into the textarea ( inside the window content ) 
  HTML('WIN_MESSAGE_CONTENT').innerHTML = _e.target.responseText;
}




