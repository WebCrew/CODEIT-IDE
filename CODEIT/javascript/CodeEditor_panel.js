ExtendClass( CodeEditor_panel , CODEIT_PanelManager );

function CodeEditor_panel(  _htmlElement , _appRef )
{
	CodeEditor_panel.baseConstructor.call(this ,  _htmlElement );
	this.appRef = _appRef;
	this.panelView = this.htmlElement.getChildById('PANEL_VIEW');
	this.tabBar = this.htmlElement.getChildById('TAB_BAR');
	CreateEventListener ( this.tabBar , "mousedown" , this.onMouseDownOnTabBar , this  );	
	this.unselectedActivatorButtonClassName = 'unselectedTab';
	this.selectedActivatorButtonClassName = 'selectedTab';
	this.hideActivePanel = false;
	this.serviceUrl = window.location;
	this.loadingState = this.htmlElement.getChildById('LOADING_toolButton');
	//this.archiveContextMenu = new   CODEIT_ContextMenu( HTML('ARCHIVE_CONTEXT_MENU') );
	var codeEditor = this;
	CreateEventListener ( HTML('SAVE_DOCUMENT_toolButton') , "mousedown" , function( _e ) { codeEditor.saveDocument( codeEditor.activePanel); }  );
}

CodeEditor_panel.prototype.onMouseDownOnTabBar = function ( _e )
{
	if( _e.target.parentElement.nodeName == 'LI' )
	{
		var codeMirrorHtmlDoc = _e.target.parentElement.panelRef;
		
		if(_e.target.nodeName == 'A')
		{
		 	this.removeDocument( codeMirrorHtmlDoc );
		 	return;
		}
	 	
	 	this.setActivePanel( codeMirrorHtmlDoc );
	 			
		//if (_e.which==3) this.archiveContextMenu.showAt( _e.clientX , _e.clientY );
    	
	}
}


CodeEditor_panel.prototype.showLoadingState = function ( )
{
	this.loadingState.style.display = 'block';
}

CodeEditor_panel.prototype.hideLoadingState = function ( )
{
	this.loadingState.style.display = 'none';
}

CodeEditor_panel.prototype.loadDocument = function ( _filePath )
{
	var openedDoc = this.getDocumentByPathFile( _filePath );
	if(openedDoc!=null){
		this.setActivePanel( openedDoc );
		return;
	}
		 
	var pathInfo = PathInfo( _filePath ); 
	
	var fileName = pathInfo.fileName;
	var fileExtension = pathInfo.fileExtension;
			
	var mode = 'text';
	
	switch(fileExtension)
	{
		case 'js':
			mode = "javascript";
		break;
		case 'php':
			mode = "application/x-httpd-php";
		break;
		case 'xml':case 'dae':
			mode =  {name: "xml", mode:"text/xml" , alignCDATA: true} ;
		break;
		case 'html': case 'htm':
			mode = { name:"htmlmixed", mode: "text/html", tabMode: "indent"};
		break;
		case 'css':
			mode = { name: "css", mode: "text/css" };
		break;
		case 'less':
			mode = { name: "less", mode: "text/css" };
		break;
		case 'md':
			mode = { name: "md", mode: "text/css" };
		break;
		case 'sql':
			mode = { name: "sql", mode: "text/css" };
		break;
	
	}
	
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'getFile', filePath:_filePath } , Bind( this , this.onLoadDocument)  );
	xhr.codeMirrorHtmlDoc = this.addDocument( fileName , 'loading…' , mode);
	xhr.codeMirrorHtmlDoc.CodeMirror.filePath = _filePath;
	xhr.codeMirrorHtmlDoc.activatorButton.setAttribute('title', _filePath );

	this.showLoadingState();

}


CodeEditor_panel.prototype.onLoadDocument = function ( _e )
{		
	var xhr = _e.target;
	this.hideLoadingState();
	xhr.codeMirrorHtmlDoc.CodeMirror.setValue(xhr.responseText);
	this.setDocumentSavedState( xhr.codeMirrorHtmlDoc , true );
}


CodeEditor_panel.prototype.getDocumentByPathFile = function ( _filePath )
{
	var codeMirrorHtmlDoc;
	var max = this.panelView.childNodes.length;
	for(var id=0; id<max; id++)
	{
		codeMirrorHtmlDoc = this.panelView.childNodes[id];
		if(codeMirrorHtmlDoc.CodeMirror.filePath == _filePath  ) return codeMirrorHtmlDoc;
	}
	return null;
}


// returns a list of documents that belong to the path as a parameter
CodeEditor_panel.prototype.getDocumentsInPath = function ( _path )
{
	var documentList = [];
	var codeMirrorHtmlDoc;
	var max = this.panelView.childNodes.length;
	for(var id=0; id<max; id++)
	{
		codeMirrorHtmlDoc = this.panelView.childNodes[id];		
		if( codeMirrorHtmlDoc.CodeMirror.filePath.indexOf( _path ) == 0 ) documentList.push(codeMirrorHtmlDoc);
	}
	return documentList;
}

// updates the path of documents starting with _pathToReplace
CodeEditor_panel.prototype.updateDocumentsPath = function ( _pathToReplace , _newPath )
{
	var codeMirrorHtmlDoc;
	var max = this.panelView.childNodes.length;
	for(var id=0; id<max; id++)
	{
		codeMirrorHtmlDoc = this.panelView.childNodes[id];
		
		if( codeMirrorHtmlDoc.CodeMirror.filePath.indexOf( _pathToReplace ) == 0 )
		{
			codeMirrorHtmlDoc.CodeMirror.filePath = codeMirrorHtmlDoc.CodeMirror.filePath.replace(_pathToReplace,_newPath);
			codeMirrorHtmlDoc.activatorButton.setAttribute('title', codeMirrorHtmlDoc.CodeMirror.filePath );
			
			codeMirrorHtmlDoc.activatorButton.getElementsByTagName('div')[0].innerHTML= PathInfo( codeMirrorHtmlDoc.CodeMirror.filePath ).fileName;
		}
	}
	
}



CodeEditor_panel.prototype.addDocument = function ( _docName , _docData , _docMode )
{
	var codeMirrorInstance = CodeMirror( this.panelView, { mode: _docMode, lineNumbers: true, scrollbarStyle: "overlay", matchBrackets: true, fixedGutter: true, theme: "twilight" });
	console.log(codeMirrorInstance);

	
	var codeMirrorHtmlDoc = codeMirrorInstance.getWrapperElement();
	codeMirrorHtmlDoc.applyScrollingByTouch();	
	//codeMirrorHtmlDoc.childNodes[2].applyScrollingByTouch();

	// created the tab button

	var newTabButton = document.createElement('li');
	newTabButton.setAttribute('title', _docName );
	newTabButton.innerHTML = '<a>&nbsp;</a><div>'+_docName+'</div>';
	this.tabBar.appendChild(newTabButton);

	this.addPanel( _docName , codeMirrorHtmlDoc, newTabButton );
	this.setActivePanel( codeMirrorHtmlDoc );
	
	var panelManager = this;
		
	codeMirrorInstance.setSize(null, this.htmlElement.offsetHeight-30);
	codeMirrorInstance.setValue(_docData);
	//codeMirrorInstance.setOption('onChange', function(){ panelManager.onDocumentChanged(codeMirrorHtmlDoc); } );
	codeMirrorInstance.on("change", function( _editor, _pos ){ panelManager.onDocumentChanged(codeMirrorHtmlDoc); } )	//codeMirrorInstance.isSaved = true;
	
	//return codeMirrorInstance;
	return codeMirrorHtmlDoc;
}


CodeEditor_panel.prototype.onResize = function ( _e )
{
	
	
	var codeMirrorHtmlDoc;
	var max = this.panelView.childNodes.length;
	for(var id=0; id<max; id++)
	{
		codeMirrorHtmlDoc = this.panelView.childNodes[id];
		codeMirrorHtmlDoc.CodeMirror.setSize(null, this.htmlElement.offsetHeight-30);;
	}
	
	
}

CodeEditor_panel.prototype.removeDocument = function ( _codeMirrorHtmlDoc )
{
	if(!_codeMirrorHtmlDoc.CodeMirror.isSaved)
	{
		var fileName = _codeMirrorHtmlDoc.CodeMirror.filePath;
		var answer = confirm( STR['Want to save the changes made in the document:']+ fileName  );
		if (answer)
		{
			this.saveDocument(_codeMirrorHtmlDoc);
			return;
		} 
	} 
	_codeMirrorHtmlDoc.activatorButton.parentElement.removeChild(_codeMirrorHtmlDoc.activatorButton);
	_codeMirrorHtmlDoc.parentElement.removeChild(_codeMirrorHtmlDoc);
}

CodeEditor_panel.prototype.onDocumentChanged = function ( _codeMirrorHtmlDoc )
{
	//_codeMirrorHtmlDoc.CodeMirror.isSaved = false;
	//console.log('changed: ' + codeMirrorHtmlDoc);
	
	if( _codeMirrorHtmlDoc.CodeMirror.isSaved == true ) this.setDocumentSavedState( _codeMirrorHtmlDoc , false );
	
}


CodeEditor_panel.prototype.setDocumentSavedState = function ( _codeMirrorHtmlDoc , _savedState )
{
	//if( _codeMirrorHtmlDoc.CodeMirror.isSaved == _savedState ) return;
	
	if(_savedState==true)
	{
		_codeMirrorHtmlDoc.activatorButton.removeClass('unsavedDoc');
		_codeMirrorHtmlDoc.activatorButton.addClass('savedDoc');
	}
	else
	{
		_codeMirrorHtmlDoc.activatorButton.removeClass('savedDoc');
		_codeMirrorHtmlDoc.activatorButton.addClass('unsavedDoc');		
	}
	
	_codeMirrorHtmlDoc.CodeMirror.isSaved = _savedState;

}


/*
CodeEditor_panel.prototype.saveDocument = function (  _e )
{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.serviceUrl , true);
	xhr.onload = Bind( this , this.onSaveDocument) ;
	xhr.codeMirrorHtmlDoc =  this.activePanel;
	var formData = new FormData();
	formData.append( 'action', 'saveFile' );
	formData.append( 'filePath', this.activePanel.CodeMirror.filePath );
	formData.append( 'fileData', this.activePanel.CodeMirror.getValue() );		
	xhr.send(formData);  // multipart/form-data	 
	
	this.showLoadingState();
}
*/


/*
CodeEditor_panel.prototype.onClickOnSaveDocumentButton = function (  _e )
{
	this.saveDocument(this.activePanel);
}
*/

CodeEditor_panel.prototype.saveDocument = function (  _codeMirrorHtmlDoc )
{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.serviceUrl , true);
	xhr.onload = Bind( this , this.onSaveDocument) ;
	xhr.codeMirrorHtmlDoc =  _codeMirrorHtmlDoc;
	var formData = new FormData();
	formData.append( 'action', 'saveFile' );
	formData.append( 'filePath', _codeMirrorHtmlDoc.CodeMirror.filePath );
	formData.append( 'fileData', _codeMirrorHtmlDoc.CodeMirror.getValue() );		
	xhr.send(formData);  // multipart/form-data	 
	
	this.showLoadingState();
}



CodeEditor_panel.prototype.onSaveDocument = function ( _e )
{		
	this.hideLoadingState();
	
	var success = DefaultResponseXML(_e);
	if( success != true ) return;
	
	this.setDocumentSavedState(_e.target.codeMirrorHtmlDoc , true );
	/*
var xhr = _e.target;
	var element_ul = xhr.element_li.getElementsByTagName('ul')[0];
	this.loadNodes( '?action=listFiles&pathDir=' + xhr.element_li.getAttribute( 'title' ) , element_ul );
*/
}

