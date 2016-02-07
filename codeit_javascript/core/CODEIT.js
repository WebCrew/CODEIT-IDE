
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimationFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( callback, element) { return window.setTimeout(callback, 1000/60); };
window.cancelCancelRequestAnimationFrame = window.cancelCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.clearTimeout;


/*
FUNCTIONS AND PROPERTIES 'GLOBAL
*/


var IS_IPHONE = navigator.userAgent.indexOf("iPhone") != -1 ;
var IS_IPOD = navigator.userAgent.indexOf("iPod") != -1 ;
var IS_IPAD = navigator.userAgent.indexOf("iPad") != -1 ;
var IS_IOS = IS_IPHONE || IS_IPOD || IS_IPAD ;

var DEVICE_WITH_TOUCH_EVENTS = "ontouchstart" in window;


	



	Array.prototype.clone = function() { return this.slice(0); }
	
	Date.prototype.daysInMonth = function () 
	{
	   return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate()
	}
	
	
	Date.prototype.toTimeStamp = function ()
	{
		var yyyy = this.getFullYear();
	    var mm = this.getMonth() + 1;
	    var dd = this.getDate();
	    var hh = this.getHours();
	    var min = this.getMinutes();
	    var ss = this.getSeconds();		
		return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
	}
	
	
	
	HTMLSelectElement.prototype.selectOptionByValue = function ( _value )
	{
		var maxOptions = this.options.length;
		for( var id=0; id<maxOptions; id++ )
		{
			if( this.options[ id ].value == _value )
			{
				this.options[ id ].selected=true;
				return;
			} 
		} 
	}
	
	
	HTMLSelectElement.prototype.getSelectOptionValue = function ()
	{
		return this.options[ this.selectedIndex ].value;
	}

	
	
	/*
Element.prototype.eventFire = function ( etype )
	{
	    if (this.fireEvent) {
	      this.fireEvent('on' + etype);
	    } else {
	      var evObj = document.createEvent('Events');
	      evObj.initEvent(etype, true, false);
	      this.dispatchEvent(evObj);
	    }
	}
*/
	
	

	Element.prototype.applyScrollingByTouch = function ( )
	{
		
		if( DEVICE_WITH_TOUCH_EVENTS )
		{
			var scrollTarget = this;
			
			scrollTarget.ontouchstart = function(_e)
			{
				this.touchStartPosY = _e.touches[0].pageY;
				this.maxScrollY = scrollTarget.scrollHeight - scrollTarget.offsetHeight;
				
				this.touchStartPosX = _e.touches[0].pageX;
				this.maxScrollX = scrollTarget.scrollWidth - scrollTarget.offsetWidth;			
			};
			
			scrollTarget.ontouchmove = function(_e)
			{
				if(GLOBAL_MOUSE_LISTENER.lockedPageScroll) return;
								
				if(_e.touches[0].pageY>this.touchStartPosY)
				{
					if(scrollTarget.scrollTop==0){ }else{ GLOBAL_MOUSE_LISTENER.preventPageScroll=false; }
				}else{
					if( scrollTarget.scrollTop==this.maxScrollY){ } else{ GLOBAL_MOUSE_LISTENER.preventPageScroll=false; }
				}
				
				if(_e.touches[0].pageX>this.touchStartPosX)
				{
					if(scrollTarget.scrollLeft==0){ }else{ GLOBAL_MOUSE_LISTENER.preventPageScroll=false; }
					return;
				}else{
					if( scrollTarget.scrollLeft==this.maxScrollX){ } else{ GLOBAL_MOUSE_LISTENER.preventPageScroll=false; }
					return;
				}
			};
		}
	
	}
	
	
	
	Element.prototype.indexOf = function (el) {
		var nodeList = this.childNodes;
		var array = [].slice.call(nodeList, 0);
		return array.indexOf(el);
	}
	
	
	Element.prototype.getPosition = function  ()
	{
	 return {x:this.offsetLeft,y:this.offsetTop};
	}
	
	Element.prototype.setPosition = function  ( _x , _y , _unit )
	{
	 	_unit = _unit || 'px';
	 	this.style.left = _x + _unit;
		this.style.top = _y + _unit;
	}
	
	Element.prototype.setPositionX = function  ( _x  , _unit )
	{
	 	_unit = _unit || 'px';
	 	this.style.left = _x + _unit;
	}
	
	Element.prototype.setPositionY = function  ( _y , _unit )
	{
	 	_unit = _unit || 'px';
		this.style.top = _y + _unit;
	}

	
	Element.prototype.getSize = function  ()
	{
	 return {x:this.offsetWidth,y:this.offsetHeight};
	}
	
	
	Element.prototype.setSize = function  ( _x , _y , _unit )
	{
	 	_unit = _unit || 'px';
	 	this.style.width = _x+ _unit;
		this.style.height = _y+ _unit;
	}
	
	Element.prototype.setSizeX = function  ( _x , _unit )
	{
	 	_unit = _unit || 'px';
	 	this.style.width = _x+ _unit;
	}
	
	
	Element.prototype.setSizeY = function  (  _y , _unit )
	{
	 	_unit = _unit || 'px';
		this.style.height = _y+ _unit;
	}

		
	
	
		
	Node.prototype.getChildById = function ( _id )
	{		
		var child = null;
		
		for( var id = 0; id<this.childNodes.length ; id++)
		{
			child = this.childNodes[id];
			if( child.id == _id ){
				 return child;
			}else{
				child = child.getChildById( _id );
				if(child) return child;
			}
		}
		
		return child;
	}
	
	
	
	Node.prototype.getChildByName = function ( _name )
	{		
		var child = null;
		
		for( var id = 0; id<this.childNodes.length ; id++)
		{
			child = this.childNodes[id];
			if( child.name == _name ){
				 return child;
			}else{
				child = child.getChildByName( _name );
				if(child) return child;
			}
		}
		
		return child;
	}
	
	
	Node.prototype.getParentByAttribute = function(_attributeName ,  _attributeValue )
	{
		if( this.hasAttribute(_attributeName) && this.getAttribute(_attributeName)==_attributeValue){
			return this;
		}else{
			if( this.parentNode != null )  return this.parentNode.getParentByAttribute( _attributeName ,  _attributeValue );
		}
		return null;		
	}
	
	
	Node.prototype.getParentById = function( _id )
	{
		if(this.id==_id){
			return this;
		}else{
			if( this.parentNode != null )  return this.parentNode.getParentById( _id );
		}
		return null;		
	}
	
	
	Node.prototype.getParentByNodeName = function( _nodeName )
	{
		if(this.nodeName==_nodeName){
			return this;
		}else{
			if( this.parentNode != null )  return this.parentNode.getParentByNodeName( _nodeName );
		}
		return null;		
	}
	
	Element.prototype.hasClass = function (cls)
	{
		return this.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}
	Element.prototype.addClass = function (cls)
	{
		if (!this.hasClass(cls)) this.className += " "+cls;
	}
	
	Element.prototype.removeClass = function (cls)
	{
		if (this.hasClass(cls)) {
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			this.className=this.className.replace(reg,' ');
		}
	}

	

	FormData.prototype.appendObject = function ( _objVars )
	{
		for (var name in _objVars) this.append(name, _objVars[ name ] );
	}

	
	
	function PathInfo ( _filePath )
	{
	 	var splittedPath = _filePath.split('/');
		var fileName = splittedPath[ splittedPath.length-1 ];
		var dir = '';
		if(splittedPath.length>1){
			splittedPath.pop();
			dir = splittedPath.join('/');
		}		
		var splittedName = fileName.split('.');
		var fileNameNoExtension = '';
		var fileExtension = '';
		if(splittedName.length>1){
			fileExtension = splittedName.pop();
			fileNameNoExtension = splittedName.join('.');
		} 
	 	return { dir:dir ,  fileName:fileName , fileNameNoExtension:fileNameNoExtension , fileExtension:fileExtension };	
	}



	function SendAndLoad( _serviceUrl , _objectData , _onLoadFunction )
	{	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', _serviceUrl , true);
		xhr.onload = _onLoadFunction ;
		if(_objectData)
		{
			var formData = new FormData();
			formData.appendObject(_objectData);
			xhr.send(formData);  // multipart/form-data	 
		}   				
  		else xhr.send('');			 				
		
		return xhr;
	}


// do nothing if SUCCESS, it shows alert if an error occurs
function DefaultResponseXML( _e )
{		
	var xhr = _e.target;
	try 
	{ 
		var xmlResponse = xhr.responseXML;
		var state = xmlResponse.getElementsByTagName('state')[0].firstChild.nodeValue;
		var message = xmlResponse.getElementsByTagName('message')[0].firstChild.nodeValue;
		if( state == "SUCCESS" )
		{
			return true;
		}
		else if( state == "ERROR" )
		{
			alert( message );
		}
		return false; 					
	}
    catch (e){}    
    alert( "An error has just be found: " + xhr.responseText);		
}


function StageSize()
{	
	var winW = 980;
	var winH = 560;
	
	if (document.body && document.body.offsetWidth)
	{
	 winW = document.body.offsetWidth;
	 winH = document.body.offsetHeight;
	}
	else if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth )
	{
	 winW = document.documentElement.offsetWidth;
	 winH = document.documentElement.offsetHeight;
	}
	else if (window.innerWidth && window.innerHeight)
	{
	 winW = window.innerWidth;
	 winH = window.innerHeight;
	}

	return{x:winW, y:winH}    		
}



//* @author Kevin Lindsey
function ExtendClass(subClass, baseClass)
{
   function inheritance() {}
   inheritance.prototype = baseClass.prototype;
   subClass.prototype = new inheritance();
   subClass.prototype.constructor = subClass;
   subClass.baseConstructor = baseClass;
   subClass.superClass = baseClass.prototype;
}


function Bind(scope, fn )
{
    return function () { return fn.apply(scope, arguments); }
}


function EventPreventDefault( e  )
{
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    return false;
}


function HTML ( _htmlElement )
{
	return document.all ? document.all[ _htmlElement ] : document.getElementById( _htmlElement );
}
	
	
	
/*

If  _capturingPhase is true the event handler is set for the capturing phase, if is false the event handler is set for the bubbling phase.

               | |
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  \ /          |     |
|   -------------------------     |
|        Event CAPTURING          |
-----------------------------------

               / \
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  | |          |     |
|   -------------------------     |
|        Event BUBBLING           |
-----------------------------------


*/


	
function CreateEventListener ( _element , _eventType , _functionListener, _bindTarget ,_capturingPhase )
{          
     if (_element.addEventListener)
     {
        if( DEVICE_WITH_TOUCH_EVENTS )
		{
			// in case of arrivals, one of these events convert into touch
			switch ( _eventType )
			{
				case "mousedown": 
					_eventType = "touchstart";
				break;
				case "mousemove": 
					_eventType = "touchmove";
				break;
				case "mouseup": 
					_eventType = "touchend";
				break;		
			}
		}
        
        _element.addEventListener(_eventType, _bindTarget ? Bind( _bindTarget, _functionListener ) : _functionListener, _capturingPhase);
     }
     else if (_element.attachEvent)
     {
         _element.attachEvent('on' + _eventType, _functionListener);
     } 
     else 
     {
         _element['on' + _eventType] = _functionListener;
     }
}

	
       
function IncludeJavascript( _url , _onLoadFunction )
{		
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = _url;
	script.type = "text/javascript";
	
	if( _onLoadFunction != undefined && _onLoadFunction != null )
	{
		if (script.readyState){  //IE
	        script.onreadystatechange = function()
	        {
	            if (script.readyState == "loaded" || script.readyState == "complete")
	            {
	                script.onreadystatechange = null;
	                _onLoadFunction();
	            }
	        };
	    } else {  //Others
	        script.onload = function(){
	            _onLoadFunction();
	        };
	    }
    }
		
	head.appendChild( script);
}


function IncludeCSS( _url )
{		
	var head = document.getElementsByTagName('head')[0];
	var css=document.createElement("link");
  	css.setAttribute("rel", "stylesheet");
  	css.setAttribute("type", "text/css");
  	css.setAttribute("href", _url);
  	head.appendChild( css);
}

