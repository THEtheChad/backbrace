/*! events.spineless.js | (c) Chad Elliott | MIT License: http://opensource.org/licenses/mit-license.php */

// Dependencies
// :: Low_Dash
// :: Spineless

(function(s9, _){

  var eventSplitter = /\s+/;

  var Events = s9.Events = {};

  Events.on = function(events, callback){
    var list, calls = this.__callbacks__ || (this.__callbacks__ = {});

    _.each(events.split(eventSplitter), function(event){
      list = calls[event] || (calls[event] = []);
      list.push(callback);
    });

    return this;
  }

  Events.off = function(events, callback){
    var list, calls, idx;

    if(calls = this.__callbacks__){
      // if no events are specified, remove all callbacks
      if(!events){
        delete this.__callbacks__;
      }
      else{
        _.each(events.split(eventSplitter), function(event){
          if(list = calls[event]){
            if(callback){
              idx = _.indexOf(list, callback);
              if(idx !== -1) list.splice(idx, 1);
            }
            // if no callback is specified,
            // remove all callbacks for the event
            else delete calls[event];
          }
        });
      }
    }
    return this;
  }

  Events.trigger = function(events){
    var list, calls, all, args = _.toArray(arguments).slice(1);

    function fire(call){ call.apply(null, args) }

    if(calls = this.__callbacks__){
      all = calls.all;
      _.each(events.split(eventSplitter), function(event){
        if(list = all         ) _.each(list, fire);
        if(list = calls[event]) _.each(list, fire);
      });
    }

    return this;
  }

})(this.s9, this._);