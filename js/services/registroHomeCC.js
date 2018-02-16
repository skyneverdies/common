/**
 * Servicios para login registro en el home
 */

app.factory("checkregistroHomeCC", function()
{ 
  var jsonRegistro={"returnCode":0,"array": []};
 
  return{
    getTotal:function(){
      return jsonRegistro.array.length;
    },
    getAll:function(){
      return jsonRegistro.array;
    },
    addone:function(){
      jsonRegistro.array.push({
                                "home": "home"
                             });
    },
    reset:function(){
      jsonRegistro.array.length = 0;
    }
  };

});

