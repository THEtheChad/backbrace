Backbone.Collection = Backbone.Collection.extend({
  subCollection: function(opts){
    var sub = new Backbone.SubCollection(null, opts);

    function subAdd   (model) { sub.sieve(model) && sub.__add__(model) }
    function subRemove(model) { sub.__remove__(model) }
    function subChange(model) {
      if(sub.sieve(model)){
        // Check if the model is already a member of the subcollection
        if(!(sub._byCid[model.cid] || (model.id && sub._byId[model.id])))
          sub.__add__(model);
      }
      else{
        sub.__remove__(model);
      }
    }

    // Tack on our custom sieve
    opts.sieve && (sub.sieve = opts.sieve);

    // Store a reference to the parent
    // (used in custom add/remove methods on sub)
    sub.parent = this;

    // Inherit parent add/remove methods
    sub.__add__    = this.add;
    sub.__remove__ = this.remove;

    // Initialize the collection
    _.each(this.models, subAdd);

    this.on('add'   , subAdd   );
    this.on('remove', subRemove);
    this.on('change', subChange);

    return sub;
  }
});

Backbone.SubCollection = Backbone.Collection.extend({
  sieve: function(){return true},
  // Adds the model to the main collection
  // which triggers an event that will add
  // it to the subcollection (if it passes the sieve)
  add: function(models, options){
    this.parent.add(models, options);
  },
  // Removes the model from the main collection
  // which will fire an event to remove it
  // from the subcollection
  remove: function(models, options){
    this.parent.remove(models, options);
  },
  updateSieve: function(func){
    this.sieve = func;
  }
});