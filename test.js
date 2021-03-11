let instance = require('./singleton');

instance.getInstance().publicMethod(); //hello Singlethon Pattern :) 
console.log(instance.getInstance().publicProp); //single value
console.log(instance.getInstance()); //{ publicMethod: [Function: publicMethod], publicProp: 'single value' }

