Backbone.Collection = Backbone.Collection.extend({
  subCollection: function(opts){
    var main = this, sub  = new Backbone.SubCollection(null, opts);

    function subAdd   (model) { sub.sieve(model) && sub.__add__(model) }
    function subRemove(model) { sub.__remove__(model) }
    function subChange(model) {
      if(sub.sieve(model)){
        if(!(sub._byCid[model.cid] || (model.id && sub._byId[model.id])))
          sub.__add__(model);
      }
      else{
        sub.__remove__(model);
      }
    }

    // Tack on our custom sieve
    opts.sieve && (sub.sieve = opts.sieve);

    // Store reference to parent
    sub.parent = main;

    // Inherit parent add and remove methods
    sub.__add__    = main.add;
    sub.__remove__ = main.remove;

    // Initialize the collection
    _.each(main.models, subAdd);

    main.on( 'add'   , subAdd    );
    main.on( 'remove', subRemove );
    main.on( 'change', subChange );

    return sub;
  }
});

Backbone.SubCollection = Backbone.Collection.extend({
  sieve: function(){return true},
  add: function(models, options){
    models = _.isArray(models) ? models.slice() : [models];

    var model, i = models.length, filtered = [];
    while(i--){
      if (!(model = models[i] = this._prepareModel(models[i], options))) {
        throw new Error("Can't add an invalid model to a collection");
      }
      model.collection = this.parent;
      if(this.sieve(model))
        filtered.push(model);
    }
    this.parent.add(models, options);
    return this.__add__(filtered, options);
  },
  remove: function(models, options){
    this.parent.remove(models, options);
    return this.__remove__(models, options);
  },
  updateSieve: function(func){
    this.sieve = func;
  }
});

a = new Backbone.Collection([{a:1,b:20},{b:1},{c:1},{a:1,b:30},{a:1,b:50}]);
b = a.subCollection({
  sieve:function(model){return model.get('a') === 1},
  comparator: function(model){
    return model.get('b') || 0;
  }
});