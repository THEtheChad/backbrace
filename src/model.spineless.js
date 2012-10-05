/*! models.spineless.js | (c) Chad Elliott | MIT License: http://opensource.org/licenses/mit-license.php */

// Dependencies
// :: Low_Dash
// :: Spineless
// :: Spineless.Model

(function(s9, _){

  var Model = s9.Model = function(attributes, options){
    attributes || (attributes = {});

    this._reset();
    this.set(attributes);
    this.cid = _.uniqueId('c');
  };

  _.extend(Model.prototype, {

    idAttribute: 'id',

    initialize: function(){},

    has: function(attr){
      return _.has(this.attributes, attr);
    },

    get: function(attr){
      return this.attributes[attr];
    },

    fireUpdate: function(attr, val){
      this.trigger('update update:' + attr, val, this)
    },

    fireChange: function(attr, val){
      this.trigger('change change:' + attr, val, this)
    },

    escape: function(attr){
      var html;
      if(html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    set: function(key, value){
      var attrs;

      if(_.isObject(key)){
        attrs = key;
      }
      else{
        attrs = {};
        attrs[key] = value;
      }

      if(!attrs) return this;
      if(attrs instanceof Model) attrs = attrs.attributes;
      if(!this._validate(attrs)) return false;

      var attr, val, prev, now = this.attributes, id = this.idAttribute;

      if(id in attrs) this.id = attrs[id];

      for(attr in attrs){
        val  = attrs[attr];
        prev = now[attr];

        now[attr] = val;

        this.fireUpdate(attr, val);
        if(!_.isEqual(prev, val))
          this.fireChange(attr, val);
      }

      return this;
    },

    unset: function(attr){
      delete this._escapedAttributes[attr];
      delete this.attributes[attr];
      this.fireUpdate(attr, null);
      this.fireChange(attr, null);
    },

    _reset: function(){
      this._escapedAttributes = {};
      this.attributes = {};
    },

    clear: function(){
      var attr, attrs = this.attributes;
      this._reset();
      this.trigger('clear', this);
      for(attr in attrs){
        this.fireUpdate(attr, null);
        this.fireChange(attr, null);
      }
    },

    isValid: function(){
      return !this.validate(this.attributes);
    },

    _validate: function(attrs){
      if(this.validate){
        var error = this.validate(attrs);
        if(error){
          this.trigger('error', error, this);
          return false;
        }
      }
      return true;
    }

  }, s9.Events);

})(this.s9, this._);