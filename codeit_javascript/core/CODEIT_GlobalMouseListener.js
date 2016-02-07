

		
	function CODEIT_GlobalMouseListener() 
	{	
		this.mouseDownPt = {x:0,y:0};
		this.mouseUpPt = {x:0,y:0};
		this.mouseMovePt = {x:0,y:0};
		this.isMouseButtonPressed = false;
		this.isDragAction = false;		
		this.checkForMouseDragPause = false;
		this.previousMouseMovePt = {x:0,y:0};
		this.checkForMouseMovePauseIntervalId = null;
		this.isMouseMovePaused = false;		
		this.snapValue = 20;
		this.isSnapped = false;
		this.objectTarget = null;
		this.snapToAngle = true;
		this.snapToAxisXY = true;
		this.lastMouseUpTime = new Date().getTime();
		this.initEventListeners();
		this.preventPageScroll = true;
		this.lockedPageScroll = false;
	}
	
	
		
	CODEIT_GlobalMouseListener.prototype.initEventListeners = function () 
	{	
		var html = document.getElementsByTagName('html')[0];
		
		if( DEVICE_WITH_TOUCH_EVENTS )
		{		
			CreateEventListener ( html , "touchstart" , this.onTouchStart , this , true ); // it establishes that the event should be taken from the upper node
			CreateEventListener ( html , "touchmove" , this.onTouchMove , this  );
			CreateEventListener ( html , "touchend" , this.onTouchEnd , this  );
		}else{
			CreateEventListener ( html , "mousedown" , this.onMouseDown , this  );
			CreateEventListener ( html , "mousemove" , this.onMouseMove , this  );
			CreateEventListener ( html , "mouseup" , this.onMouseUp , this  );
		}

	}

	
	CODEIT_GlobalMouseListener.prototype.startSnap = function ( _snapValue )
	{
		this.snapValue = _snapValue || 20;
		this.isSnapped = true;
		this.previousMouseMovePt.x = this.mouseMovePt.x;
		this.previousMouseMovePt.y = this.mouseMovePt.y;
	}
	
	// It is called every half second

	CODEIT_GlobalMouseListener.prototype.lookForMouseMovePause = function (_e)
	{				
		if(this.isSnapped)return;
		
		if( this.previousMouseMovePt.x == this.mouseMovePt.x  && this.previousMouseMovePt.y == this.mouseMovePt.y )
		{
			if( this.isMouseMovePaused ) return;			
			this.onMouseMoveStartPause(_e);
			this.isMouseMovePaused = true;
			return;		
		}
		
		if( this.isMouseMovePaused )
		{
			this.onMouseMoveEndPause(_e);
			this.isMouseMovePaused = false;
		}
		
		this.previousMouseMovePt.x = this.mouseMovePt.x;
		this.previousMouseMovePt.y = this.mouseMovePt.y;
	}
	
		
	CODEIT_GlobalMouseListener.prototype.onMouseClick = function (_e)
	{				
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseDoubleClick = function (_e)
	{		
	}
	
	CODEIT_GlobalMouseListener.prototype.onStartDrag = function (_e)
	{
		if( this.checkForMouseDragPause ) this.checkForMouseMovePauseIntervalId = setInterval(Bind(this,this.lookForMouseMovePause), 100);
		if( this.objectTarget && this.objectTarget.onGlobalMouseEndDrag ) this.objectTarget.onGlobalMouseStartDrag(_e);		
	}
	
	CODEIT_GlobalMouseListener.prototype.onEndDrag = function (_e)
	{
		if( this.checkForMouseDragPause )
		{
			clearInterval ( this.checkForMouseMovePauseIntervalId );
			this.isMouseMovePaused = false;
			this.isSnapped = false;
		}
		if( this.objectTarget && this.objectTarget.onGlobalMouseEndDrag )this.objectTarget.onGlobalMouseEndDrag(_e);
		this.snapToAngle = true;		
	}
	
	CODEIT_GlobalMouseListener.prototype.onDrag = function (_e)
	{	
		
		/*
if(this.snapToAxisXY)
		{
			if(Math.abs(this.mouseMovePt.x - this.mouseDownPt.x)>Math.abs(this.mouseMovePt.y - this.mouseDownPt.y))
			{
				this.mouseMovePt.y = this.mouseDownPt.y;
			}else{
				this.mouseMovePt.x = this.mouseDownPt.x;
			}
		}
*/
		
		
		if(_e.shiftKey && this.snapToAngle ) this.calculateSnapToAngle();
		if( this.objectTarget && this.objectTarget.onGlobalMouseDrag ) this.objectTarget.onGlobalMouseDrag( _e );	
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseWheel = function (_e)
	{		
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseMoveStartPause = function ( _e )
	{
		if(this.isDragAction) this.onStartPauseDrag(_e);
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseMoveEndPause = function ( _e )
	{
		if(this.isDragAction) this.onEndPauseDrag(_e);
	}
		
	CODEIT_GlobalMouseListener.prototype.onStartPauseDrag = function (_e)
	{	
		if( this.objectTarget && this.objectTarget.onGlobalMouseDragStartPause )this.objectTarget.onGlobalMouseDragStartPause(_e);	
	}
		
	CODEIT_GlobalMouseListener.prototype.onEndPauseDrag = function (_e)
	{	
		if( this.objectTarget && this.objectTarget.onGlobalMouseDragEndPause )this.objectTarget.onGlobalMouseDragEndPause(_e);	
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseDown = function ( _e )
	{		
		this.eventLocationToPoint( _e , this.mouseDownPt );
		
		this.mouseMovePt.x = this.mouseDownPt.x;
		this.mouseMovePt.y = this.mouseDownPt.y;
		
		if( _e.srcElement instanceof HTMLUListElement  )
		{

		}else{
			this.isMouseButtonPressed = true;
			if( this.objectTarget && this.objectTarget.onGlobalMouseDown ) this.objectTarget.onGlobalMouseDown( _e );
		}
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseUp = function ( _e )
	{
		this.eventLocationToPoint( _e , this.mouseUpPt );
		if( this.objectTarget && this.objectTarget.onGlobalMouseUp ) this.objectTarget.onGlobalMouseUp( _e );
		
		var currentTime = new Date().getTime();
		if( ( currentTime - this.lastMouseUpTime )< 250  ) if( this.objectTarget && this.objectTarget.onGlobalMouseDoubleClick ) this.objectTarget.onGlobalMouseDoubleClick( _e );		
		this.lastMouseUpTime = currentTime;

		
		this.isMouseButtonPressed = false;
		if(this.isDragAction) this.onEndDrag(_e);		
		this.isDragAction = false;
		this.objectTarget = null; 
	}
	
	CODEIT_GlobalMouseListener.prototype.onMouseClick = function ( _e )
	{
		if( this.objectTarget && this.objectTarget.onGlobalMouseClick ) this.objectTarget.onGlobalMouseClick( _e );
	}	
	
	CODEIT_GlobalMouseListener.prototype.onMouseMove = function ( _e)
	{
		
		
		if( this.preventPageScroll ) _e.preventDefault();
		this.preventPageScroll = true;


				 
		this.eventLocationToPoint( _e , this.mouseMovePt );
				
		if(this.isSnapped)
		{
			if( this.distanceFromPoints( this.mouseMovePt , this.previousMouseMovePt ) < this.snapValue ) return;
			this.isSnapped = false;			
		}
									
		if(this.isMouseButtonPressed)
		{
			if(this.isDragAction){
				this.onDrag(_e);
				return;
			}
			
			if( this.distanceFromPoints( this.mouseMovePt , this.mouseDownPt ) > 5 )
			{
				this.isDragAction=true;
				this.onStartDrag(_e);
			}
			
			return;
		}
		
		if( this.objectTarget && this.objectTarget.onGlobalMouseMove ) this.objectTarget.onGlobalMouseMove( _e );
	}
	
	CODEIT_GlobalMouseListener.prototype.startDrag = function (_e)
	{
		this.isDragAction=true;		
		this.onStartDrag( null );			
	}

	CODEIT_GlobalMouseListener.prototype.onTouchStart = function ( _e )
	{			
		this.onMouseDown(_e);
	}
	
	CODEIT_GlobalMouseListener.prototype.onTouchMove = function ( _e )
	{	
		this.onMouseMove(_e);
	}
		
	CODEIT_GlobalMouseListener.prototype.onTouchEnd = function ( _e )
	{
		if( _e.targetTouches.length == 0 ) this.onMouseUp(_e);
	}
		
	CODEIT_GlobalMouseListener.prototype.onTouchCancel = function ( _e )
	{		
	}
	
	CODEIT_GlobalMouseListener.prototype.resetState = function ( )
	{	
		this.isDragAction=false;
		this.isSnapped = false;
		this.isMouseButtonPressed = false;
		this.isMouseMovePaused = false
		this.objectTarget = null;	
	}

	CODEIT_GlobalMouseListener.prototype.eventLocationToPoint = function ( _e , _point2D )
	{
		if( IS_IOS )
		{
			if (_e.targetTouches.length > 0)
			{
				_point2D.x = _e.targetTouches[0].pageX;
				_point2D.y = _e.targetTouches[0].pageY;
			}
		}
		else
		{
			if (!_e)  _e = window.event;
			
			if (_e.pageX || _e.pageY)
			{
				_point2D.x = _e.pageX;
				_point2D.y = _e.pageY;
			}
			else if (_e.clientX || _e.clientY)
			{
				_point2D.x = _e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				_point2D.y = _e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
		}
	}
	
	CODEIT_GlobalMouseListener.prototype.distanceFromPoints = function( _pt1 , _pt2 )
	{
		var _x = _pt2.x - _pt1.x;
		var _y = _pt2.y - _pt1.y;
		return Math.sqrt((_x*_x)+(_y*_y)); 
	}

	CODEIT_GlobalMouseListener.prototype.calculateSnapToAngle = function ()
	{
		var snap = Math.PI/4; // 45 degrees
		var dx = this.mouseMovePt.x - this.mouseDownPt.x;
		var dy = this.mouseMovePt.y - this.mouseDownPt.y;
		var angle = Math.atan2(dy,dx);
		var dist = Math.sqrt(dx * dx + dy * dy);
		var snapangle= Math.round(angle/snap)*snap;
		this.mouseMovePt.x = this.mouseDownPt.x + dist*Math.cos(snapangle);	
		this.mouseMovePt.y = this.mouseDownPt.y + dist*Math.sin(snapangle);
	}
	
	
	

	// to create generic objects draggable
	
	CODEIT_GlobalMouseListener.prototype.elementChildrenToDraggableElements = function ( _elementContainer )
	{		
		for( var id = 0; id<_elementContainer.childNodes.length ; id++){
			
			if( _elementContainer.childNodes[id].nodeType != 3 )this.createDraggableElement( _elementContainer.childNodes[id] );
		} 
	}
	
	
	CODEIT_GlobalMouseListener.prototype.createDraggableElement = function ( _elementToDrag )
	{
		//this.draggableElement = _elementToDrag;
		CreateEventListener (_elementToDrag , "mousedown" , this.onMouseDownOnDraggableElement , this  );
	}



	CODEIT_GlobalMouseListener.prototype.onMouseDownOnDraggableElement = function ( _e  )
	{
		this.draggableElement = _e.target;
		var position = this.draggableElement.getPosition();
		this.draggableElement.dragOffsetX = GLOBAL_MOUSE_LISTENER.mouseMovePt.x - position.x   ;
		this.draggableElement.dragOffsetY =  GLOBAL_MOUSE_LISTENER.mouseMovePt.y - position.y ;
		GLOBAL_MOUSE_LISTENER.objectTarget = this;
	}


	CODEIT_GlobalMouseListener.prototype.onGlobalMouseDrag = function ( _e )
	{
	 	this.draggableElement.setPosition( GLOBAL_MOUSE_LISTENER.mouseMovePt.x - this.draggableElement.dragOffsetX  , GLOBAL_MOUSE_LISTENER.mouseMovePt.y - this.draggableElement.dragOffsetY  );		 	 
	}


	
	
	var GLOBAL_MOUSE_LISTENER = new CODEIT_GlobalMouseListener();
	
	