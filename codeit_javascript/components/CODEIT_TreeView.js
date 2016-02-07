function CODEIT_TreeView(  _htmlElement  )
{
	this.htmlElement = _htmlElement;
	CreateEventListener ( this.htmlElement , "mousedown" , this.onMouseDown , this  );
	this.unselectedNodeClassName = 'unselectedNode';
	this.selectedNodeClassName = 'selectedNode';
	this.collapsedNodeClassName = 'collapsedNode';
	this.expandedNodeClassName = 'expandedNode';
	this.dragOverNodeClassName = 'dragOverNode';
	this.selectedNodes = [];
	this.lastMouseDownTime = null;
}

CODEIT_TreeView.prototype.onMouseDown = function ( _e )
{
	
	if( _e.target.parentElement.nodeName == 'LI' )
	{
		if(_e.target.nodeName == 'A')
		{
		 	this.expandOrCollapseNode(_e.target.parentElement);
		}
		else if(_e.target.nodeName == 'DIV')
		{
		 	this.selectNode(_e.target.parentElement);
		 	if( this.isDoubleClick() ) this.onDoubleClickOnNodeName( _e.target );
		 	return;
		}
		
		if (_e.which==3)
		{
			//this.archiveContextMenu.showAt( _e.clientX , _e.clientY );
			this.showNodeContextMenu( _e );
		} 
	}
	
	//this.lastMouseDownTime = new Date().getTime();
	
}

CODEIT_TreeView.prototype.isDoubleClick = function (  )
{
	var currentMouseDownTime = new Date().getTime();
	if( ( currentMouseDownTime - this.lastMouseDownTime )< 250  ) return true;	
	this.lastMouseDownTime = currentMouseDownTime;
	return false;		
}

CODEIT_TreeView.prototype.onDoubleClickOnNodeName = function ( _element_div )
{
	this.editNodeName(_element_div);	
}

// in firefox  You must disable drag the nodes to be able to select the input text
CODEIT_TreeView.prototype.disableDraggableNodes = function ( )
{
	var draggableElements = document.querySelectorAll('#'+ this.htmlElement.getAttribute('id')+' li[draggable="true"]');
	for (var i=0; i<draggableElements.length; i++){
   		draggableElements[i].setAttribute('draggable', 'disabled');
  	}
}

CODEIT_TreeView.prototype.enableDraggableNodes = function ( )
{
	var draggableElements = document.querySelectorAll('#'+ this.htmlElement.getAttribute('id')+' li[draggable="disabled"]');
	for (var i=0; i<draggableElements.length; i++){
   		draggableElements[i].setAttribute('draggable', 'true');
  	}
}

CODEIT_TreeView.prototype.editNodeName = function ( _element_div )
{
	this.disableDraggableNodes();
	var itemName = _element_div.textContent;
	_element_div.innerHTML = '<input type="text"  class="inputNodeName" value="'+itemName+'"  onBlur="if(this.value==\'\')this.value=this.previousValue;  if(this.value!=this.previousValue) this.onChangedValue(this); this.parentNode.innerHTML=this.value;" ></input>';
	
	var self = this;
	setTimeout(function()
	{
	 	_element_div.firstChild.previousValue=itemName;
	 	_element_div.firstChild.focus();	 	
	 	_element_div.firstChild.onChangedValue = function(_input){self.onEndEditNodeName(_input)};
	},100);
	
	
}

CODEIT_TreeView.prototype.onEndEditNodeName = function ( _element_input )
{
	this.enableDraggableNodes();
	//must be redefined	and called super
}

CODEIT_TreeView.prototype.showNodeContextMenu = function ( _e )
{
	//must be redefined	
}


/*
CODEIT_TreeView.prototype.expandOrCollapseNode = function( _element_li  )
{
	var element_ul = _element_li.getElementsByTagName('ul')[0];
	
	if( element_ul )
	{
		if( element_ul.style.display == 'none' || element_ul.style.display == '' ){
			element_ul.style.display = 'block';
			_element_li.className = this.expandedNodeClassName;
		}else{
			element_ul.style.display = 'none';
			_element_li.className = this.collapsedNodeClassName;
		}
	}
	
	return element_ul;
}
*/


CODEIT_TreeView.prototype.expandOrCollapseNode = function( _element_li  )
{
	//var element_ul = _element_li.getElementsByTagName('ul')[0];
	var element_ul = this.getNodeElement_ul( _element_li );
	if( element_ul )
	{
		if( element_ul.style.display == 'none' || element_ul.style.display == '' )
		{
			this.expandNode(_element_li);
		}else{
			this.collapseNode(_element_li);
		}
	}
	
	return element_ul;
}


CODEIT_TreeView.prototype.expandNode = function(_element_li)
{
	/*
_element_li.removeClass(this.collapsedNodeClassName);
	_element_li.addClass(this.expandedNodeClassName);
*/
	_element_li.classList.remove(this.collapsedNodeClassName);
	_element_li.classList.add(this.expandedNodeClassName);


	var element_ul = this.getNodeElement_ul(_element_li);
	element_ul.style.display = 'block';
	
	if( element_ul.hasAttribute( 'url' ) )
	 {
	 	element_ul.innerHTML = '';
	 	this.loadNodeChildren( element_ul.getAttribute( 'url' )  , element_ul  );
	 }
	 return element_ul;	
}


CODEIT_TreeView.prototype.collapseNode = function(_element_li)
{
	this.getNodeElement_ul(_element_li).style.display = 'none';
	_element_li.classList.remove(this.expandedNodeClassName);
	_element_li.classList.add(this.collapsedNodeClassName);
	/*
_element_li.removeClass(this.expandedNodeClassName);
	_element_li.addClass(this.collapsedNodeClassName);
*/
}


CODEIT_TreeView.prototype.loadNodeChildren = function ( _url , _element_ul )
{
	//must be redefined
}


CODEIT_TreeView.prototype.getNodeElement_ul = function (  _element_li )
{		
	return _element_li.getElementsByTagName('ul')[0];	
}



CODEIT_TreeView.prototype.selectNode = function(_element_li)
{
	this.deselectAllNodes();
	this.selectedNodes.push(_element_li);
	_element_li.classList.remove(this.unselectedNodeClassName);
	_element_li.classList.add(this.selectedNodeClassName);
	/*
_element_li.removeClass(this.unselectedNodeClassName);
	_element_li.addClass(this.selectedNodeClassName);
*/
}

CODEIT_TreeView.prototype.deselectNode = function(_element_li)
{
	var id = this.selectedNodes.indexOf( _element_li );
	if(id == -1 ) return;
	
	this.selectedNodes.splice(id, 1);
	
	_element_li.classList.remove(this.selectedNodeClassName);
	_element_li.classList.add(this.unselectedNodeClassName);
	/*
_element_li.removeClass(this.selectedNodeClassName);
	_element_li.addClass(this.unselectedNodeClassName);
*/

}


CODEIT_TreeView.prototype.deselectAllNodes = function()
{
	var max = this.selectedNodes.length;
	for( var id=0; id<max; id++ )
	{
		this.selectedNodes[id].classList.remove(this.selectedNodeClassName);
		this.selectedNodes[id].classList.add(this.unselectedNodeClassName);
		/*
this.selectedNodes[id].removeClass(this.selectedNodeClassName);
		this.selectedNodes[id].addClass(this.unselectedNodeClassName);
*/
	}
	this.selectedNodes = [];
}


/*
CODEIT_TreeView.prototype.createNodeHTML = function ( _iconType , _textLabel, _title , _hasChildren )
{
	var newNodeHTML = '<li class="collapsedNode" title="'+_title+'" >';
	newNodeHTML += '<a>&nbsp;</a><div class="treeViewItemIcon_'+_iconType+'" >'+_textLabel+'</div>';
	if(_hasChildren==true) newNodeHTML += '<ul></ul>';
	newNodeHTML += '</li> ';
	return  newNodeHTML;
}
*/

CODEIT_TreeView.prototype.createTreeViewNode = function (  _iconType , _textLabel, _title , _hasChildren )
{
	var element_li = document.createElement('li');
	element_li.className = "collapsedNode";
	element_li.setAttribute('title' , _title );
	
	// Button expand 
	var element_a = document.createElement('a');
	element_a.innerHTML = '&nbsp';	
	element_li.appendChild(element_a) ;
			
	// Icon
	var element_div = document.createElement('div');
	element_div.className = 'treeViewItemIcon_'+_iconType;
	element_div.innerHTML = _textLabel;
	element_li.appendChild(element_div) ;	
	
	// if you have children
	if(_hasChildren==true)
	{
		// container for the children
		element_ul = document.createElement('ul');
		element_li.appendChild(element_ul) ;
	} 	

	
	return element_li;
}





