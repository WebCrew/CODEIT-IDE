
// MAIN 
var codeit_app = null;
			
function init()
{
	codeit_app = new CODEIT_app();
}

function hideAboutPanel( _e )
{	
	HTML('ABOUT_PANEL').style.display = 'none';	
	HTML('APPLICATION_LAYOUT').removeEventListener( 'mouseup' , hideAboutPanel , true );
}



window.addEventListener("load", init, false);




// APPLICATION CLASS 


function CODEIT_app( )
{						
	this.version = '1.0';
	
	// PANELS
	this.fileBrowserPanel = new FileBrowser_panel( HTML('FILE_BROWSER_PANEL') , this );
	this.codeEditor_panel = new CodeEditor_panel( HTML('CODE_EDITOR_PANEL') , this );
	
	// WIDGETS COLUMN LEFT
	this.widgetManagerColumnLeft = new CODEIT_WidgetManager( HTML('COLUMN_LEFT') );
	this.widgetManagerColumnLeft.addWidget( this.fileBrowserPanel.htmlElement, this.fileBrowserPanel.htmlElement.getChildById('EXPAND_WIDGET_toolButton') );
	
	// WIDGETS COLUMN RIGHT
	this.widgetManagerColumnRight = new CODEIT_WidgetManager( HTML('COLUMN_RIGHT') ); 
	var widget = this.widgetManagerColumnRight.addWidget( this.codeEditor_panel.htmlElement, this.codeEditor_panel.htmlElement.getChildById('EXPAND_WIDGET_toolButton') );
	this.widgetManagerColumnRight.addEventListener( CODEIT_WidgetManager.CHANGE, Bind( this.codeEditor_panel, this.codeEditor_panel.onResize ) );

	this.messageWin = new CODEIT_Window( HTML('MESSAGE_WIN') );
	//this.messageWin.open( true );
	
	this.showAboutPanel();
	
	window.addEventListener("unload", Bind( this, this.onExit ), false);
	window.onbeforeunload = Bind( this, this.confirmExit );
	window.onresize = Bind(this,this.onBrowserResize);
	
	
	CreateEventListener ( HTML('ABOUT_APP_menuItem') , "mouseup" , this.showAboutPanel , this  );
	CreateEventListener ( HTML('UPDATE_APP_menuItem') , "mouseup" , this.checkForUpdates , this  );
	CreateEventListener ( HTML('DOCS_APP_menuItem') , "mouseup" , this.showDocs , this  );
	CreateEventListener ( HTML('LOGOUT_menuItem') , "mouseup" , this.logout , this  );
	
}


CODEIT_app.prototype.onBrowserResize = function( _e )
{
	this.widgetManagerColumnLeft.updateWidgetLayout();
	this.widgetManagerColumnRight.updateWidgetLayout();
	//console.log('onBrowserWinResize');
}


CODEIT_app.prototype.showAboutPanel = function( _e )
{
	HTML('ABOUT_PANEL').style.display = 'block';
	HTML('APPLICATION_LAYOUT').addEventListener( 'mouseup' , hideAboutPanel ,true );
}


CODEIT_app.prototype.checkForUpdates = function( _e )
{
	window.open( 'http://www.web-crew.org/' );
}


CODEIT_app.prototype.showDocs = function( _e )
{
	window.open( '../CODEIT/documentation/docu.html' );
}

CODEIT_app.prototype.logout = function( _e )
{
	window.location = '?action=doUserLogout' ;
}


CODEIT_app.prototype.confirmExit = function(_element_li)
{
	return STR['Are you sure you want to exit the application?'];
}

CODEIT_app.prototype.onExit = function(_element_li)
{

}




