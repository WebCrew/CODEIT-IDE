
function CODEIT_Window(  _htmlElement  )
{	
	this.htmlElement = _htmlElement;
	//this.tweenScrollX = new Tween(this.htmlElement.style,'left',Tween.strongEaseOut, 0,0,1,'px');
	//this.tweenScrollY = new Tween(this.htmlElement.style,'top',Tween.strongEaseOut, 0,0,1,'px');
	this.initEventHandlers();
	this.dragOffset = {x:0,y:0};	
	this.bringToFront();
	this.dragAction = null;
	this.minSizeX = 150;
	this.minSizeY = 50;
	this.storedSize=null;
	this.appOwner = null;
	this.content = this.htmlElement.getChildById('WIN_CONTENT');
	
	this.eventDispatcher = new CODEIT_EventDispatcher();
}

CODEIT_Window.prototype.initEventHandlers = function ()
{	
	CreateEventListener ( this.htmlElement , "mousedown" , this.onMouseDown , this  );
}

CODEIT_Window.prototype.setTitle = function ( _title )
{
	var headTitle = this.htmlElement.getChildById('WIN_TITLE');
	headTitle.innerHTML = _title;
}

CODEIT_Window.prototype.open = function ( _centered )
{
	this.htmlElement.style.display = 'block';
		
	if(_centered==true){
		var screenSize = StageSize();
		var winSize = this.htmlElement.getSize();
		this.setPosition( (screenSize.x/2-winSize.x/2) ,  (screenSize.y/2-winSize.y/2));
	}
	
	this.bringToFront();	
}

CODEIT_Window.prototype.close = function ()
{
	this.htmlElement.style.display = 'none';
}




CODEIT_Window.prototype.isOpen = function ()
{
	if( this.htmlElement.style.display == 'block') return true;
	return false;
}


CODEIT_Window.prototype.bringToFront = function ()
{
	if( !this.htmlElement.parentNode.maxLevel ) this.htmlElement.parentNode.maxLevel=1;	
	this.htmlElement.parentNode.maxLevel++;
	this.htmlElement.style.zIndex = this.htmlElement.parentNode.maxLevel; 
}


CODEIT_Window.prototype.getPosition = function  (  )
{
	 return {x:this.htmlElement.offsetLeft, y:this.htmlElement.offsetTop };
}

CODEIT_Window.prototype.setPosition = function  ( _x , _y )
{
	this.htmlElement.style.left = _x+'px';
	this.htmlElement.style.top = _y+'px';
}

CODEIT_Window.prototype.setSize = function  ( _x , _y )
{
	 this.htmlElement.style.width = _x+'px';
	this.htmlElement.style.height = _y+'px';
}

CODEIT_Window.prototype.getSize = function  ()
{
	 return {x:this.htmlElement.offsetWidth, y:this.htmlElement.offsetHeight };
	 //return {x: parseInt(this.htmlElement.style.width) , y:parseInt(this.htmlElement.style.height) };
}

CODEIT_Window.prototype.onMouseDown = function ( _e )
{
	this.bringToFront();
	
	var eventTarget =_e.srcElement?_e.srcElement:_e.target;
	
	if(!eventTarget)return;
	
	if( (eventTarget.parentNode) && (eventTarget.parentNode.getAttribute('id') == 'WIN_HEAD') || (eventTarget.parentNode) && (eventTarget.parentNode.getAttribute('id')=='WIN_TITLE') ||  eventTarget.getAttribute && (eventTarget.getAttribute('id') == 'WIN_HEAD') )
	{
		this.dragAction = 'DRAG_WIN';
		var winPos = this.getPosition();
		this.dragOffset.x = GLOBAL_MOUSE_LISTENER.mouseMovePt.x - winPos.x;
		this.dragOffset.y = GLOBAL_MOUSE_LISTENER.mouseMovePt.y - winPos.y;
		GLOBAL_MOUSE_LISTENER.objectTarget = this;
	}
	else if( eventTarget.getAttribute && eventTarget.getAttribute('id') == 'WIN_CLOSE_BUTTON')
	{
		this.close();
	}
	
	else if(  eventTarget.getAttribute && eventTarget.getAttribute('id') == 'WIN_RESIZE_BUTTON')
	{
		this.dragAction = 'RESIZE_WIN';
		var winPos = this.getPosition();
		var winSize = this.getSize();
		this.dragOffset.x = winPos.x + winSize.x - GLOBAL_MOUSE_LISTENER.mouseMovePt.x ;
		this.dragOffset.y = winPos.y + winSize.y - GLOBAL_MOUSE_LISTENER.mouseMovePt.y ;
	
		GLOBAL_MOUSE_LISTENER.objectTarget = this;
	}
	else if( eventTarget.getAttribute && eventTarget.getAttribute('id') == 'WIN_COLLAPSE_BUTTON' )
	{		
		
		if( this.content.style.display == 'none'   ){
			if(this.storedSize)this.setSize(this.storedSize.x ,this.storedSize.y);
			this.content.style.display = 'block';
			var resizeButton = this.htmlElement.getChildById('WIN_RESIZE_BUTTON');
			if(resizeButton.style.display = 'block');
		}
		else if( this.content.style.display == '' || this.content.style.display == 'block')
		{
			this.storedSize = this.getSize();
			this.setSize(this.storedSize.x , 24 );
			this.content.style.display = 'none';
			var resizeButton = this.htmlElement.getChildById('WIN_RESIZE_BUTTON');
			if(resizeButton.style.display = 'none');
		}
	}
}

/*
CODEIT_Window.prototype.onTouchStart = function ( _e )
{
	this.onMouseDown( _e);	
}
*/
 
 

// called by 	GLOBAL_MOUSE_LISTENER

CODEIT_Window.prototype.onGlobalMouseStartDrag = function ( )
{	
}
// called by 	GLOBAL_MOUSE_LISTENER 

CODEIT_Window.prototype.onGlobalMouseEndDrag = function ( )
{		 
 GLOBAL_MOUSE_LISTENER.objectTarget = null ;
 this.dragAction=null;	 
}



// called by GLOBAL_MOUSE_LISTENER
 CODEIT_Window.prototype.onGlobalMouseDrag = function ( _e )
 {
 	if(this.dragAction=='DRAG_WIN')
 	{
 		this.setPosition( (GLOBAL_MOUSE_LISTENER.mouseMovePt.x - this.dragOffset.x) , (GLOBAL_MOUSE_LISTENER.mouseMovePt.y - this.dragOffset.y) );		 	 
	} 
	else if(this.dragAction=='RESIZE_WIN')
	{
	 	var winPos = this.getPosition();
	 	var newSizeX = GLOBAL_MOUSE_LISTENER.mouseMovePt.x - winPos.x + this.dragOffset.x ;
	 	var newSizeY = GLOBAL_MOUSE_LISTENER.mouseMovePt.y - winPos.y + this.dragOffset.y ;
	 	if(newSizeX<this.minSizeX)newSizeX=this.minSizeX;
	 	if(newSizeY<this.minSizeY)newSizeY=this.minSizeY;
	  	this.setSize(  newSizeX ,  newSizeY);
	 }
 }


 