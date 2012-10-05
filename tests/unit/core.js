// obj = {};

// function t(arg){
//   return function(){
//     console.log(arg, arguments);
//   }
// }

function temp(){
  ops = 99999;
  obj = {};

  i = ops;
  while(i--){
    obj[i] = i;
  }

  model = new s9.Model(obj);

  model.on('change', function(){});
  model.on('update', function(){});

  i = ops;
  while(i--){
    model.get(i);
  }

  i = ops;
  while(i--){
    model.set(i, i+1);
  }
}