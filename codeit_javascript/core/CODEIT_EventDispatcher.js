function CODEIT_EventDispatcher(){
    this.listeners = {};
}


CODEIT_EventDispatcher.prototype.dispatch = function(event)
{
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this.listeners[event.type] instanceof Array){
            var listeners = this.listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
};


CODEIT_EventDispatcher.prototype.addEventListener = function(type, listener)
{
        if (typeof this.listeners[type] == "undefined"){
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
};


CODEIT_EventDispatcher.prototype.removeEventListener = function(type, listener)
{
    if (this.listeners[type] instanceof Array)
    {
        var listeners = this.listeners[type];
        for (var i=0, len=listeners.length; i < len; i++)
        {
            if (listeners[i] === listener)
            {
                listeners.splice(i, 1);
                break;
            }
        }
    }
};
