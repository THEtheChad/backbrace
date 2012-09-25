  var a = new Backbone.Collection([{a:1},{a:1},{a:1},{a:1},{a:1,b:2}]);
  var b = a.subCollection({sieve:function(m){return m.get('a') === 1}});



test('Maintain SubCollection', function(){
  var a = new Backbone.Collection([{a:1},{a:1},{a:1},{a:1},{a:1,b:2}]);
  var b = a.subCollection({sieve:function(m){return m.get('a') === 1}});

  equal(a.length, b.length, 'Initial collections are equivalent');
  a.remove(a.at(0));
  equal(a.length, b.length, 'Collections remain equivalent after removing a model from main collection');
  b.remove(b.at(0));
  equal(a.length, b.length, 'Collections remain equivalent after removing a model from sub collection');
  a.add({a:1});
  equal(a.length, b.length, 'Collections are equivalent after adding a model to main collection that passes the sieve');
  b.add({a:1});
  equal(a.length, b.length, 'Collections are equivalent after adding a model to sub collection that passes the sieve');
  a.at(1).set('a', 2);
  equal(a.length, b.length + 1, 'Altering a model on main collection so that it doesn\'t pass the sieve removes it from sub');
  b.at(0).set('a', 2);
  equal(a.length, b.length + 2, 'Altering a model on sub collection so that it doesn\'t pass the sieve removes it from sub');
  a.at(0).set('a', 1);
  equal(a.length, b.length + 1, 'Altering a model on main collection so that it passes the sieve adds it to sub');
  b.sieve(function(m){return m.get('b') === 2});
  equal(b.length, 1, 'Altering sieve on sub updates the collection to reflect those changes');
  a.reset();
  equal(a.length, b.length, 'Resetting main resets the sub as well');
});

// test('Events Fire Correctly', function(){
//   a.on('add', function(){
//     ok(true, 'Add event fired on main collection');
//   })
//   a.on('remove', function(){
//     ok(true, 'Remove event fired on main collection');
//   })
//   a.on('change', function(){
//     ok(true, 'Change event fired on main collection');
//   })

//   b.on('add', function(){
//     ok(true, 'Add event fired on sub collection');
//   })
//   b.on('remove', function(){
//     ok(true, 'Remove event fired on sub collection');
//   })
//   b.on('change', function(){
//     ok(true, 'Change event fired on sub collection');
//   })
// });