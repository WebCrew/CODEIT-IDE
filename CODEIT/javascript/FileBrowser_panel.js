ExtendClass( FileBrowser_panel , CODEIT_TreeView );

function FileBrowser_panel(  _htmlElement , _appRef )
{
	FileBrowser_panel.baseConstructor.call(this ,  _htmlElement );
	
	this.appRef = _appRef;
	this.serviceUrl = window.location;
	
	this.panelView = this.htmlElement.getChildById('PANEL_VIEW');
	this.panelView.applyScrollingByTouch();
	/*
this.collapsedNodeClassName = 'collapsedNode';
	this.expandedNodeClassName = 'expandedNode';
*/
	
	this.loadingState = this.htmlElement.getChildById('LOADING_toolButton');
	this.uploadingState = this.htmlElement.getChildById('UPLOADING_BAR');
	
	
	//this.archiveContextMenu = new   CODEIT_ContextMenu( HTML('ARCHIVE_CONTEXT_MENU') );
	CreateEventListener ( this.panelView , "dragover" , function(_e){ _e.stopPropagation(); _e.preventDefault(); return false; }  );
	
	CreateEventListener ( HTML('DEFINE_EXECUTABLE_FILE_menuItem') , "mousedown" , this.defineExecutableFilePath , this  );
	CreateEventListener ( HTML('EXECUTE_FILE_toolButton') , "mousedown" , this.runExecutableFile , this  );
	
	CreateEventListener ( HTML('CREATE_FOLDER_menuItem') , "mousedown" , this.createDir , this  );
	CreateEventListener ( HTML('REMOVE_FILE_menuItem') , "mousedown" , this.removeFile , this  );
	CreateEventListener ( HTML('COPY_FILE_menuItem') , "mousedown" , this.copyFile , this  );
	CreateEventListener ( HTML('PASTE_FILE_menuItem') , "mousedown" , this.pasteFile , this  );
	CreateEventListener ( HTML('DOWNLOAD_FILE_menuItem') , "mousedown" , this.downloadFile , this  );
					        		
	CreateEventListener ( HTML('CREATE_FILE_XML_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_JS_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_PHP_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_CSS_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_HTML_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_LESS_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_MD_menuItem') , "mousedown" , this.createNewFile , this  );
	CreateEventListener ( HTML('CREATE_FILE_SQL_menuItem') , "mousedown" , this.createNewFile , this  );

	



	this.lastMouseDownTime = null;
	this.isLocked = false;
	
	this.clipboard = {};
	
	this.executableFilePath = ''; // The main file of a project to be executed
	this.executableFileWindow=null;	
}


FileBrowser_panel.prototype.defineExecutableFilePath = function ( _e )
{
	if( this.selectedNodes.length==0 )return;
	this.executableFilePath = this.getNodePath( this.selectedNodes[0] );
}


FileBrowser_panel.prototype.runExecutableFile = function ( _e )
{
	if(this.executableFilePath==''){
		alert( STR['The main file is not defined. Please, select "Define as main file" from the menu.'] );
		return;
	}
	
	console.log(this.executableFileWindow);
	
	if(this.executableFileWindow!=null && this.executableFileWindow.location ){
		this.executableFileWindow.location = '?action=runExecutableFile&filePath='+this.executableFilePath;
	}
	else
	{
		this.executableFileWindow = window.open( '?action=runExecutableFile&filePath='+this.executableFilePath );
		//var self = this;
		//setTimeout( function(){ this.executableFileWindow.addEventListener("unload", function(_e){ self.executableFileWindow=null;  }, false); },100);
	}
	
	this.executableFileWindow.focus();
}



FileBrowser_panel.prototype.downloadFile = function ( _e )
{	
	if( this.selectedNodes.length==0 )return;	
	window.open( '?action=downloadFile&filePath='+this.getNodePath( this.selectedNodes[0] ) );
}



FileBrowser_panel.prototype.onEndEditNodeName = function ( element_input )
{
	FileBrowser_panel.superClass.onEndEditNodeName.call( this , element_input ) ;
	
	
	var element_li =  element_input.parentElement.parentElement;
	
	if( element_li.nodeName == 'LI' )
	{
		var newName = element_input.value;
	
		if( ! this.isValidFileName( newName )  )
		{
			element_li.getElementsByTagName('div')[0].innerHTML=element_input.previousValue;
			return;
		}
	
		if( element_li.hasAttribute( 'itemType' ) )
		{
			var itemType = element_li.getAttribute( 'itemType' );
	 		
	 		if( itemType == 'file' ||  itemType == 'dir' )
	 		{
	 			var oldPath = this.getNodePath( element_li );				
				this.renameFile( oldPath ,  newName , element_li /* , oldName */ );
	 		}	
		}
	}
}



FileBrowser_panel.prototype.selectNode = function(_element_li)
{
	FileBrowser_panel.superClass.selectNode.call( this , _element_li ) ;
	
	if( _element_li.hasAttribute( 'itemType' ) )
	{
		var itemType = _element_li.getAttribute( 'itemType' );
 		
 		if(itemType == 'file' )
 		{
 			var filePath = this.getNodePath( _element_li ); 			
 			var pathInfo = PathInfo( filePath );
 			 			
 			switch( pathInfo.fileExtension )
			{
				case 'jpg':case 'jpeg': case 'png': case 'pdf': case 'zip': case 'gif':
					return;
				break;
			}
		
 			this.appRef.codeEditor_panel.loadDocument( filePath );		
 		} 				
	}		
}


FileBrowser_panel.prototype.expandNode = function( _element_li  )
{	
	var element_ul = FileBrowser_panel.superClass.expandNode.call( this , _element_li ) ;
	if( (element_ul != undefined) &&  this.isDirectoryNode( _element_li ) ) this.loadNodeChildren( _element_li );		
}


FileBrowser_panel.prototype.showLoadingState = function ( )
{
	this.loadingState.style.display = 'block';
}

FileBrowser_panel.prototype.hideLoadingState = function ( )
{
	this.loadingState.style.display = 'none';
}

FileBrowser_panel.prototype.showUploadingState = function ( )
{
	this.uploadingState.style.display = 'block';
}

FileBrowser_panel.prototype.hideUploadingState = function ( )
{
	this.uploadingState.style.display = 'none';
}


FileBrowser_panel.prototype.loadNodeChildren = function ( _element_li )
{
	this.loadNodes( '?action=listFiles&pathDir=' + this.getNodePath( _element_li ) , this.getNodeElement_ul( _element_li ) );
}


FileBrowser_panel.prototype.loadNodes = function ( _url , _contentTargetElement )
{
	if(!_contentTargetElement)_contentTargetElement = this.panelView;
	
	_contentTargetElement.innerHTML = '';
	
	this.showLoadingState();
	
	var browserPanel = this;
	SendAndLoad( _url  , null , function(_e){ browserPanel.hideLoadingState();  _contentTargetElement.innerHTML = _e.target.responseText } );
}

FileBrowser_panel.prototype.isValidFileName = function (  _fileName  )
{
	if (/[^a-z0-9\.\s\-\_]/gi.test(_fileName)) return false;
	return true;
}


FileBrowser_panel.prototype.getNodeFileType = function (  _element )
{		
	if( ! _element ) return null;
	if( ! _element.hasAttribute( 'itemType' ) ) return null;
	return _element.getAttribute( 'itemType' );	
}

FileBrowser_panel.prototype.isDirectoryNode = function (  _element )
{		
	if(this.getNodeFileType(_element) == 'dir' )return true;
	return false;	
}

FileBrowser_panel.prototype.isFileNode = function (  _element )
{		
	if(this.getNodeFileType(_element) == 'dir' )return false;
	return true;	
}


FileBrowser_panel.prototype.getNodePath = function (  _element )
{		
	return _element.getAttribute('title');	
}

FileBrowser_panel.prototype.setNodePath = function (  _element , _path )
{		
	 _element.setAttribute('title' , _path);	
}




FileBrowser_panel.prototype.createDir = function (  _e )
{
	if( ! this.isDirectoryNode( this.selectedNodes[0] )  )return;
	var xhr = SendAndLoad( this.serviceUrl , {action:'createDir', parentDirPath:this.getNodePath(this.selectedNodes[0]) } , Bind( this , this.onCreateDir)  );
	xhr.element_li = this.selectedNodes[0];
	this.showLoadingState();
}


FileBrowser_panel.prototype.onCreateDir = function ( _e )
{		
	this.hideLoadingState();
	
	var success = DefaultResponseXML(_e);
	if( success != true ) return;

	var xhr = _e.target;
	this.loadNodeChildren( xhr.element_li );
	//this.loadNodes( '?action=listFiles&pathDir=' + this.getNodePath( xhr.element_li ) , this.getNodeElement_ul( xhr.element_li ) );
}


FileBrowser_panel.prototype.createNewFile = function (  _e )
{
	if( this.selectedNodes.length==0 )return;
	if( ! this.isDirectoryNode( this.selectedNodes[0] )  )return;
	
	var parentDirPath = this.getNodePath( this.selectedNodes[0] );
	
	// the type of file to be created is an attribute of the clicked button
	var element_menuItem = 	_e.target;
	if( ! element_menuItem.hasAttribute( 'fileType' ) ) return;
	var fileType = element_menuItem.getAttribute( 'fileType' );
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'createNewFile', fileType:fileType, parentDirPath:parentDirPath } , Bind( this , this.onCreateNewFile)  );
	xhr.element_li = this.selectedNodes[0];
	
	this.showLoadingState();
}

FileBrowser_panel.prototype.onCreateNewFile = function ( _e )
{		
	this.hideLoadingState();
	
	var success = DefaultResponseXML(_e);
	if( success != true ) return;

	var xhr = _e.target;
	this.loadNodeChildren( xhr.element_li );
}



FileBrowser_panel.prototype.removeFile = function (  _e )
{
	if( this.selectedNodes.length==0 )return;
	var element_li = this.selectedNodes[0];
		
	var itemName = element_li.getElementsByTagName('div')[0].textContent;
	if(itemName == 'Hard disk' || itemName == STR['Trash'] )
	{
		alert( STR['You can not remove the item:'] + "\n\n"+itemName+"!");
		return;
	} 
		
	if( this.getNodeFileType(element_li) == null ) return;
	
	var filePath = this.getNodePath( element_li );
	
	var openedDocList = this.appRef.codeEditor_panel.getDocumentsInPath(filePath);
	if(openedDocList.length>0)
	{
		alert( STR['There are opened documents relative to the path:'] + '\n\n'+filePath+'.\n\n' + STR['Close the documents and try again.'] );
		return;
	}
	
	var answer = confirm( STR['Are you sure you want to remove the element:']+'\n\n'+ filePath );
	if ( ! answer  )return;
 			
	var xhr = SendAndLoad( this.serviceUrl , {action:'removeFile', filePath:filePath } , Bind( this , this.onRemoveFile)  );
	xhr.element_li = element_li;
	
	this.showLoadingState();
}

FileBrowser_panel.prototype.onRemoveFile = function (  _e )
{
	this.hideLoadingState();
	
	var success = DefaultResponseXML(_e);
	if( success != true ) return;
	
	this.selectedNodes = [];
	
	var xhr = _e.target;
	//var element_li = xhr.element_li;
	xhr.element_li.parentNode.removeChild(xhr.element_li);
	//this.loadNodes( '?action=listFiles&pathDir=' + xhr.parentFolder_element_li.getAttribute( 'title' ) , element_ul );

}

FileBrowser_panel.prototype.copyFile = function (  _e )
{
	if( this.selectedNodes.length==0 )return;
	var element_li = this.selectedNodes[0];
	
	var itemName = element_li.getElementsByTagName('div')[0].textContent;
	if(itemName == 'Hard disk'){
		alert(STR['You can not copy the item Hard disk!']);
		return;
	} 
	
	if( this.getNodeFileType(element_li) == null ) return;
	//this.clipboard.copiedPath = this.getNodePath( element_li );
	this.clipboard.copiedNode = element_li ;
	console.log(this.clipboard);
}


FileBrowser_panel.prototype.pasteFile = function (  _e )
{
	if(this.selectedNodes.length==0)return;
	if( ! this.isDirectoryNode( this.selectedNodes[0] )  )return;
	if(!this.clipboard.copiedNode) return;
			
	this.duplicateFile( this.clipboard.copiedNode , this.selectedNodes[0]);	
}



/*
FileBrowser_panel.prototype.pasteFile = function (  _e )
{
	if(this.selectedNodes.length==0)return;
	if( ! this.isDirectoryNode( this.selectedNodes[0] )  )return;
	if(!this.clipboard.copiedNode) return;
	
	var element_li = this.selectedNodes[0];
	
	var sourcePath = this.getNodePath( this.clipboard.copiedNode );
	var targetPath = this.getNodePath( element_li );
	
	var sourcePathInfo = PathInfo( sourcePath );
	
	if(targetPath=='')
	{
		targetPath = sourcePathInfo.fileName;
	}
	else
	{
		targetPath = targetPath+'/'+sourcePathInfo.fileName;
	}
	
	//alert(' sourcePath ' +sourcePath + '   targetPath ' + targetPath );
	
		
	if( targetPath.indexOf( sourcePath ) == 0 )
	{	
		// you are not replicating files in the same folder
	  	if(sourcePath != targetPath )
	  	{
	  		alert('You can not copy a folder into itself or a daughter folder!');
			return;
	  	}
	} 
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'duplicateFile', sourcePath:sourcePath, targetPath:targetPath } , Bind( this , this.onPasteFile)  );
	xhr.element_li = element_li;	
}


FileBrowser_panel.prototype.onPasteFile = function (  _e )
{
	console.log(_e);
	this.hideLoadingState();
	
	var xhr = _e.target;
	
	var success = DefaultResponseXML(_e);
	if( success )
	{
		this.loadNodeChildren( xhr.element_li );
		//this.loadNodes( '?action=listFiles&pathDir=' + this.getNodePath( xhr.element_li ) , this.getNodeElement_ul(  xhr.element_li ) );
		return;
	}
	
	try 
	{
		var xmlResponse = xhr.responseXML;
		var filesToReplace = xmlResponse.getElementsByTagName('fileToReplace');
		var sourcePath , targetPath, splittedSourcePath , fileName;
		var maxFiles = filesToReplace.length;
		
		for( var id=0; id<maxFiles; id++ )
		{
			sourcePath = filesToReplace[id].getAttribute('sourcePath');
			targetPath = filesToReplace[id].getAttribute('targetPath');
			//alert('Replace the file: '+ targetPath );
			splittedSourcePath = sourcePath.split('/');
			fileName = splittedSourcePath[splittedSourcePath.length-1] ;

			var answer = confirm( 'An element with the name:'+ fileName + ' already exists.\Do you want to replace it?' );
			if (answer)
			{
				var xhr2 = SendAndLoad( this.serviceUrl , {action:'duplicateFile', sourcePath:sourcePath, targetPath:targetPath , replaceFileTarget:true } , Bind( this , this.onPasteFile)  );
				xhr2.element_li = xhr.element_li;
			}  	
		}
	}
	catch (e){}    
	
}
*/


FileBrowser_panel.prototype.renameFile = function (  _filePath , _newFileName , _element_li  )
{
	this.isLocked = true;
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'renameFile', filePath:_filePath , newFileName:_newFileName } , Bind( this , this.onRenameFile)  );
	xhr.filePath = _filePath;
	xhr.newFileName = _newFileName;
	xhr.element_li = _element_li;
	
	this.showLoadingState();
}


FileBrowser_panel.prototype.onRenameFile = function ( _e )
{				
	this.hideLoadingState();
	this.isLocked = false;
	
	var success = DefaultResponseXML(_e);
	
	var xhr = _e.target;
	var oldFilePath = xhr.filePath;
	var oldFilePathInfo = PathInfo( oldFilePath );
	
	if( success != true )
	{
		 // restore the old name
		 element_li.getElementsByTagName('div')[0].innerHTML= oldFilePathInfo.fileName;
		 return;
	}
	
	var element_li = xhr.element_li;
		
	
	var newFileName = xhr.newFileName;
	var newFilePath = newFileName;
	if(oldFilePathInfo.dir!='') newFilePath = oldFilePathInfo.dir+'/'+newFileName;
	
	this.setNodePath(  element_li , newFilePath );
	
	var itemType = element_li.getAttribute( 'itemType' );
		
	if( itemType == 'file' )
	{
		var splittedFileName = newFileName.split('.');
		var className = ''; 
		if(splittedFileName.length>0) className = 'treeViewItemIcon_'+splittedFileName[splittedFileName.length-1];
		element_li.getElementsByTagName('div')[0].className = className;
	}
	else if( itemType == 'dir' )
	{
		// I take all of them visible sub nodes (only present if the node is expanded) to update the path
		var subElements_li = element_li.getElementsByTagName('li');
		
		var oldSubPath , newSubPath ;
		var max = subElements_li.length;
		for(var id=0; id<max; id++)
		{
			oldSubPath = this.getNodePath( subElements_li[id]) ;
			newSubPath = oldSubPath.replace( oldFilePath , newFilePath );
			this.setNodePath(  subElements_li[id] , newSubPath );
			//subElements_li[id].setAttribute('title', newSubPath );
		}
		
		
	}
	
	this.appRef.codeEditor_panel.updateDocumentsPath( oldFilePath , newFilePath );
}



/*
FileBrowser_panel.prototype.onRenameFile = function ( _e )
{				
	this.hideLoadingState();
	this.isLocked = false;
	
	var success = DefaultResponseXML(_e);
	
	
	var xhr = _e.target;
	var filePath = xhr.filePath;
	var splittedPath = filePath.split('/');
	var oldFileName = splittedPath.pop();
	var element_li = xhr.element_li;
		
	if( success != true )
	{
		 element_li.getElementsByTagName('div')[0].innerHTML=oldFileName;
		 return;
	}
	

	var newFileName = xhr.newFileName;
	var renamedFilePath = newFileName;
	if(splittedPath.length>0) renamedFilePath = splittedPath.join('/')+'/'+newFileName;
	
	
	element_li.setAttribute('title', renamedFilePath );
	
	var itemType = element_li.getAttribute( 'itemType' );
		
	if( itemType == 'file' )
	{
		var splittedFileName = newFileName.split('.');
		var className = ''; 
		if(splittedFileName.length>0) className = 'treeViewItemIcon_'+splittedFileName[splittedFileName.length-1];
		element_li.getElementsByTagName('div')[0].className = className;
	}
	else if( itemType == 'dir' )
	{
		// I take all of the sub nodes contained them (present if the node is expanded) to update the path
		var subElements_li = element_li.getElementsByTagName('li');
		
		var oldSubPath , newSubPath ;
		var max = subElements_li.length;
		for(var id=0; id<max; id++)
		{
			oldSubPath = subElements_li[id].getAttribute('title');
			newSubPath = oldSubPath.replace( filePath , renamedFilePath );
			subElements_li[id].setAttribute('title', newSubPath );
		}
		
		
	}
	
	this.appRef.codeEditor_panel.updateDocumentPath(filePath , renamedFilePath );
}
*/



FileBrowser_panel.prototype.onUploadFileProgress = function(_e)
{
	this.uploadingState.value += _e.loaded ;				  
}
	
FileBrowser_panel.prototype.onUploadFileEnd = function(_e)
{
	var success = DefaultResponseXML(_e);
	if( success != true ) return;
	
	if(this.uploadingState.value == this.uploadingState.max )
	{
		this.uploadingState.value=null;
		this.uploadingState.max=null;
		this.hideUploadingState();
	}
	
	var xhr = _e.target;
	this.loadNodeChildren( xhr.element_li );
/*
	var element_ul = xhr.element_li.getElementsByTagName('ul')[0];
	this.loadNodes( '?action=listFiles&pathDir=' + xhr.element_li.getAttribute( 'title' ) , element_ul );
*/
				  
}	
	
/*
FileBrowser_panel.prototype.uploadFile = function ( _file , _remoteTargetPath  )
{
  	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.serviceUrl , true);
	  				
	xhr.onload = Bind( this, this.onUploadFileEnd );
	xhr.upload.onprogress = Bind( this, this.onUploadFileProgress );
		 				
	var formData = new FormData();
	formData.append('action', 'uploadFile' );
	formData.append('targetPath', _remoteTargetPath );
	formData.append('Filedata', _file);
	xhr.send(formData);  // multipart/form-data
	
	return xhr;
}
*/

FileBrowser_panel.prototype.uploadFile = function ( _file , _remoteTargetPath  )
{
  	this.uploadingState.max += _file.size ;
	console.log( _file.name + ' ' + this.uploadingState.max);
  	this.showUploadingState();
  	  	
  	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.serviceUrl , true);
	  				
	xhr.onload = Bind( this, this.onUploadFileEnd );
	xhr.upload.onprogress = Bind( this, this.onUploadFileProgress );
		 				
	var formData = new FormData();
	formData.append('action', 'uploadFile' );
	formData.append('targetPath', _remoteTargetPath );
	formData.append('Filedata', _file);
	xhr.send(formData);  // multipart/form-data
	
	return xhr;
}



FileBrowser_panel.prototype.onCheckBeforeUpload = function (  _e )
{
	console.log(_e);
	this.hideLoadingState();
		
	try 
	{
		var xhr = _e.target;
		var xmlResponse = xhr.responseXML;
		
		var state = xmlResponse.getElementsByTagName('state')[0].firstChild.nodeValue;
		var message = xmlResponse.getElementsByTagName('message')[0].firstChild.nodeValue;
		
		if( state == "EXISTENT_FILE" )
		{
			var answer = confirm( STR['An element named:']+'\n\n'+ xhr.fileToUpload.name + '\n\n'+STR['already exists in the destination folder']+'!\n'+STR['Do you want to replace it?'] );
			if ( ! answer  )return;
		}
		else if( state == "ERROR" )
		{
			alert( message );
			return;
		}
		 
		// if all goes well it uploads
		
		var xhr2 = this.uploadFile( xhr.fileToUpload , xhr.remoteDirPath   );
		xhr2.element_li = xhr.element_li;
		
	}
	catch (e)
	{
		alert( STR['There was an unknown error while checking files!'] + xhr.responseText);	
	}    
	
}

/*
FileBrowser_panel.prototype.onDragEnterNode = function ( _e  )
{
	var element_li = _e.target.getParentByAttribute('itemtype', 'dir' );
	
	if(element_li == this.dragOverNodeClassName ) return;
	
	//element_li.eventFire( 'mouseover' );
	element_li.classList.add(this.dragOverNodeClassName);
	
	
	if(this.lastDragEnterNode)this.lastDragEnterNode.classList.remove(this.dragOverNodeClassName);
	this.lastDragEnterNode = element_li;	
}
*/


FileBrowser_panel.prototype.onDragOverNode = function ( _e  )
{
	var element_li = _e.target.getParentByAttribute('itemtype', 'dir' );
	//if(element_li == this.lastDragEnterNode ) return;
	//element_li.eventFire( 'mouseover' );
	element_li.classList.add(this.dragOverNodeClassName);
	//this.lastDragEnterNode = element_li;	
}

FileBrowser_panel.prototype.onDragLeaveNode = function ( _e  )
{
	var element_li = _e.target.getParentByAttribute('itemtype', 'dir' );
	element_li.classList.remove(this.dragOverNodeClassName);
	//element_li.eventFire( 'mouseout' );
}


FileBrowser_panel.prototype.onDragStartNode = function ( _e  )
{
	_e.dataTransfer.setData('text/plain', ' '); // for Firefox, otherwise drag
	console.log(  _e);
	this.clipboard.dragNode = _e.target ;
	console.log( this.clipboard.dragNode );
	
	if(!_e.altKey){
		_e.dataTransfer.effectAllowed='move';
	}
	
	
	_e.stopPropagation();
	
	/*
if (_e.preventDefault) _e.preventDefault();
	return false;
*/

	
}


FileBrowser_panel.prototype.onDropOnNode = function ( _e  )
{		
	this.onDragLeaveNode(_e);
	
	_e.stopPropagation();
    _e.preventDefault();
    
    
    
    var element_li = _e.target.getParentByAttribute('itemtype', 'dir' );
    
    
    console.log( 'onDropOnNode');
	console.log(  element_li );
    
    if(!element_li)return;
    
    this.clipboard.dropNode = element_li;
    
    var remoteDirPath = element_li.getAttribute('title');
    
    
    		
	if( _e.dataTransfer.types == 'Files' )
	{
		this.showLoadingState();
		
		var xhr;
		var files = _e.dataTransfer.files;
		var fileToUpload = null;    
    	var max = files.length;
		
		for(var id=0; id<max; id++)
		{		    		
    		xhr = SendAndLoad( this.serviceUrl , {action:'checkForExistentFile', filePath:remoteDirPath+'/'+ files[id].name  } , Bind( this , this.onCheckBeforeUpload)  );
    		fileToUpload = files[id];
			xhr.remoteDirPath = remoteDirPath;
			xhr.fileToUpload = fileToUpload;
			xhr.element_li = element_li;	
	    }   
	}
	else if ( this.clipboard.dragNode && this.clipboard.dropNode )
	{
		if(_e.altKey){
			this.duplicateFile( this.clipboard.dragNode , this.clipboard.dropNode );
		}
		else
		{
			this.moveFile( this.clipboard.dragNode , this.clipboard.dropNode );
		}
		
		this.clipboard = {};
	}	
}


FileBrowser_panel.prototype.duplicateFile = function ( _source_element_li , _target_element_li )
{
	if(_source_element_li == _target_element_li ) return;
	
	var sourcePath = this.getNodePath( _source_element_li );
	var targetPath = this.getNodePath( _target_element_li );
	
	var sourcePathInfo = PathInfo( sourcePath );
	
	if(targetPath=='')
	{
		targetPath = sourcePathInfo.fileName;
	}
	else
	{
		targetPath = targetPath+'/'+sourcePathInfo.fileName;
	}
	
	
	if( targetPath.indexOf( sourcePath ) == 0 )
	{	
		
		// You are not replicating files in the same folder
	  	if(sourcePath != targetPath )
	  	{
	  		alert(STR['You can not paste a folder into itself or folder daughter!']);
			return;
	  	}
	  	
		/*
// you cant duplicating files in the same folder
	  	if(sourcePath == targetPath )
	  	{
	  		//alert('This is the same file!');
			return;
	  	}
	  	else{
	  		alert('You can not copy a folder inside itself or into a daughter-folder');
			return;
	  	}
*/
	} 
	
	//alert(' sourcePath ' +sourcePath + '   targetPath ' + targetPath );
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'duplicateFile', sourcePath:sourcePath, targetPath:targetPath } , Bind( this , this.onDuplicateFile)  );
	xhr.source_element_li = _source_element_li;
	xhr.target_element_li = _target_element_li;	
}


FileBrowser_panel.prototype.onDuplicateFile = function (  _e )
{
	console.log(_e);
	this.hideLoadingState();
	
	var xhr = _e.target;
	
	var success = DefaultResponseXML(_e);
	if( success )
	{
		this.loadNodeChildren( xhr.target_element_li );
		return;
	}
	
	try 
	{
		var xmlResponse = xhr.responseXML;
		var filesToReplace = xmlResponse.getElementsByTagName('fileToReplace');
		var sourcePath , targetPath, splittedSourcePath , fileName;
		var maxFiles = filesToReplace.length;
		
		for( var id=0; id<maxFiles; id++ )
		{
			sourcePath = filesToReplace[id].getAttribute('sourcePath');
			targetPath = filesToReplace[id].getAttribute('targetPath');
			
			var targetPathInfo = PathInfo( targetPath );
			
			fileName = targetPathInfo.fileName;
			dirName =  targetPathInfo.dir;
			
			var answer = confirm( STR['An element named:']+'\n\n"'+ fileName + '"\n\n'+STR['already exists in the destination folder']+':\n\n"'+dirName+'".\n\n'+STR['Do you want to replace it?'] );

			if (answer)
			{
				var xhr2 = SendAndLoad( this.serviceUrl , {action:'duplicateFile', sourcePath:sourcePath, targetPath:targetPath , replaceFileTarget:true } , Bind( this , this.onDuplicateFile)  );
				xhr2.source_element_li = xhr.source_element_li;
				xhr2.target_element_li = xhr.target_element_li;
			}  	
		}
	}
	catch (e)
	{
		alert( STR['An unknown error occurred while copying files or folders!'] + ' ' + xhr.responseText);
	}    
	
}





FileBrowser_panel.prototype.moveFile = function ( _source_element_li , _target_element_li )
{
	if(_source_element_li == _target_element_li ) return;
	
	var sourcePath = this.getNodePath( _source_element_li );
	var targetPath = this.getNodePath( _target_element_li );
	
	var sourcePathInfo = PathInfo( sourcePath );
	
	if(targetPath=='')
	{
		targetPath = sourcePathInfo.fileName;
	}
	else
	{
		targetPath = targetPath+'/'+sourcePathInfo.fileName;
	}
	
	
	if( targetPath.indexOf( sourcePath ) == 0 )
	{	
		// you cant duplicating files in the same folder
	  	if(sourcePath == targetPath )
	  	{
	  		//alert('This is the same file!');
			return;
	  	}
	  	else{
	  		alert(STR['You can not move a folder into itself or folder daughter!'] );
			return;
	  	}
	} 
	
	//alert(' sourcePath ' +sourcePath + '   targetPath ' + targetPath );
	
	var xhr = SendAndLoad( this.serviceUrl , {action:'moveFile', sourcePath:sourcePath, targetPath:targetPath } , Bind( this , this.onMoveFile)  );
	xhr.source_element_li = _source_element_li;
	xhr.target_element_li = _target_element_li;
	xhr.sourcePath = sourcePath;
	xhr.targetPath = targetPath;	
}


FileBrowser_panel.prototype.onMoveFile = function (  _e )
{
	console.log(_e);
	this.hideLoadingState();
	
	var xhr = _e.target;
	
	var success = DefaultResponseXML(_e);
	if( success )
	{
		this.loadNodeChildren( xhr.target_element_li );		
		if( xhr.source_element_li.parentNode ) this.loadNodeChildren( xhr.source_element_li.parentNode.getParentByAttribute('itemtype', 'dir' ) );
		this.appRef.codeEditor_panel.updateDocumentsPath( xhr.sourcePath  , xhr.targetPath  );
		return;
	}
	
	try 
	{
		var xmlResponse = xhr.responseXML;
		var filesToReplace = xmlResponse.getElementsByTagName('fileToReplace');
		var sourcePath , targetPath, splittedSourcePath , fileName , dirName;
		var maxFiles = filesToReplace.length;
		
		for( var id=0; id<maxFiles; id++ )
		{
			sourcePath = filesToReplace[id].getAttribute('sourcePath');
			targetPath = filesToReplace[id].getAttribute('targetPath');
			
			var targetPathInfo = PathInfo( targetPath );
			
			fileName = targetPathInfo.fileName;
			dirName =  targetPathInfo.dir;
			
			var answer = confirm( STR['An element named:']+'\n\n"'+ fileName + '"\n\n'+STR['already exists in the destination folder']+':\n\n"'+dirName+'".\n\n'+STR['Do you want to replace it?'] );
			//var answer = confirm( 'An item with the name: \ n \ n '' + + fileName '"\ n \ n is already present in the folder: \ n \ n' '+ + dirname'." \ N \ n Do you want to replace it?' );
			if (answer)
			{
				var xhr2 = SendAndLoad( this.serviceUrl , {action:'moveFile', sourcePath:sourcePath, targetPath:targetPath , replaceFileTarget:true } , Bind( this , this.onMoveFile)  );
				xhr2.source_element_li = xhr.source_element_li;
				xhr2.target_element_li = xhr.target_element_li;
				xhr2.sourcePath = sourcePath;
				xhr2.targetPath = targetPath;
			}  	
		}
	}
	catch (e)
	{
		alert( STR['An unknown error occurred while moving files or folders!'] + xhr.responseText);
	}    
	
}









/*
FileBrowser_panel.prototype.remove(element_li)
{

}
FileBrowser_panel.prototype.moveTo(element_li)
{

}
FileBrowser_panel.prototype.copyTo(element_li)
{

}
FileBrowser_panel.prototype.getParent(element_li)
{

}

FileBrowser_panel.prototype.toURL(element_li)
{

}
*/