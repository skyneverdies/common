/**
 * Servicios para la home CC
 */

app.factory("checkTokenCC", function()
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

