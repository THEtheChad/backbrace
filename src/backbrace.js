Backbone.Collection = Backbone.Collection.extend({
  subCollection: function(opts){
    var sub = new Backbone.SubCollection(null, opts);

    opts || (opts = {});

    // Tack on our custom sieve
    opts.sieve && (sub._sieve = opts.sieve);

    // Store a reference to the parent
    // (used in custom add/remove methods on sub)
    sub.parent = this;

    // Inherit parent methods
    sub.__add__    = this.add;
    sub.__remove__ = this.remove;

    // Initialize the collection
    _.each(this.models, function(m){ sub.subAdd(m) });

    // Add our bindings
    this.on('add'   , function(m){ sub.subAdd(m)     });
    this.on('reset' , function(c){ sub.reset()       });
    this.on('remove', function(m){ sub.__remove__(m) });

    this.on('change', function(model){
      if(sub._sieve(model)){
        // Check if the model is already a member of the subcollection
        if(!(sub._byCid[model.cid] || (model.id && sub._byId[model.id])))
          sub.__add__(model);
      }
      else{
        sub.__remove__(model);
      }
    });

    return sub;
  }
});

Backbone.SubCollection = Backbone.Collection.extend({
  // Default sieve
  _sieve: function(){
    return true
  },

  sieve: function(func){
    this._sieve = func;
    this.reset();
    return this;
  },

  add: function(models, opts){
    this.parent.add(models, opts);
    return this;
  },

  remove: function(models, opts){
    this.parent.remove(models, opts);
    return this;
  },

  reset: function(opts){
    var sub = this;

    opts || (opts = {});

    _.each(this.models, this._removeReference);
    this._reset();
    _.each(this.parent.models, function(model){
      sub.subAdd(model, opts);
    });
    if(!opts.silent) this.trigger('reset', this, opts);
    return this;
  },

  subAdd: function(model, opts){
    this._sieve(model) && this.__add__(model, opts);
    return this;
  }
});