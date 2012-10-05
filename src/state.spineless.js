/*! state.spineless.js | (c) Chad Elliott | MIT License: http://opensource.org/licenses/mit-license.php */

// Dependencies
// :: Low_Dash
// :: Spineless
// :: Events

(function(s9, _){

  var eventSplitter = /\s+/;

  var State = s9.State = _.extend(s9.Events);

  State.phase = function(subject){
    var prev, state = prev = this.__state__ || (this.__state__ = {});

    if(_.isString(subject)) return state[subject];

    var k, curr, next, changes = [];
    for(k in subject){
      curr = state[k];
      next = subject[k];

      if(_.isEqual(curr, next)) continue;

      state[k] = next;

      changes.push(k);
    }

    while(next = changes.pop()){
      this.trigger('state:' + next, prev, state);
    }

    this.trigger('state', prev, state);
  }

})(this.s9, this._);