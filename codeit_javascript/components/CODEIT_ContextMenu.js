
function CODEIT_ContextMenu(  _htmlElement  )
{	
	this.htmlElement = _htmlElement;
	if( !CODEIT_ContextMenu.contextMenuContainer ) CODEIT_ContextMenu.defineContextMenuContainer();
}

CODEIT_ContextMenu.prototype.showAt = function ( _x , _y )
{
	this.htmlElement.setPosition( _x ,  _y );
	CODEIT_ContextMenu.activeContextMenu = this;	
}

CODEIT_ContextMenu.prototype.hide = function ()
{
	this.htmlElement.style.display = 'none';
	CODEIT_ContextMenu.activeContextMenu = null;
}

CODEIT_ContextMenu.prototype.show = function ()
{
	this.htmlElement.style.display = 'block';
}

// static methods ad Properties

CODEIT_ContextMenu.contextMenuContainer = null;
CODEIT_ContextMenu.activeContextMenu = null;


CODEIT_ContextMenu.onMouseDown = function ( _e )
{
	if(CODEIT_ContextMenu.activeContextMenu)
	{
	
		if(CODEIT_ContextMenu.activeContextMenu.htmlElement.style.display == 'block' )
		{
			CODEIT_ContextMenu.activeContextMenu.hide();
		}
		else
		{
			CODEIT_ContextMenu.activeContextMenu.show();
		}
				
	} 	
}


CODEIT_ContextMenu.defineContextMenuContainer = function ( )
{
	if(HTML('CONTEXT_MENU_CONTAINER'))
	{
		CODEIT_ContextMenu.contextMenuContainer = HTML('CONTEXT_MENU_CONTAINER');
		var html = document.getElementsByTagName('html')[0];
		
		if( DEVICE_WITH_TOUCH_EVENTS )
		{		
			CreateEventListener ( html , "touchstart" , CODEIT_ContextMenu.onMouseDown , CODEIT_ContextMenu , false );
		}else{
			CreateEventListener ( html , "mousedown" , CODEIT_ContextMenu.onMouseDown , CODEIT_ContextMenu , false );
		}	
	} 
}