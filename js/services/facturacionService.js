/**
 * Servicios para la home CC
 */

app.factory("facturacionService", function()
{ 
  var datosFactura={"returnCode":0,"array": []};
  var noTicket = "";
  var noTicketreenvio = "";
  var bandera = 0;
  var banderaReenvio = 0;
  var estadoFacturacion;
  var preguntasFrecuentes={"returnCode":0,"array": []};


  return{
    putBandera:function(){
      bandera = 1;
    },
    getBandera:function(){
      return bandera;
    },
    resetBandera:function(){
      bandera = 0;
    },
    addDatosFactura:function(datos){
      datosFactura.array.push(datos);
    },
    getDatosFactura:function(){
      return datosFactura.array;
    },
    resetDatosFactura:function(){
      datosFactura.array.length = 0;
    },
    resetNumTicket:function(){
      noTicket = "";
    },
    putNoTicket:function(num){
      noTicket = num;
    },
    getNoTicket:function(){
      return noTicket;
    },
    putBanderaReenvio:function(){
      bandera = 1;
    },
    getBanderaReenvio:function(){
      return banderaReenvio;
    },
    resetBanderaReenvio:function(){
      bandera = 0;
    },
    resetNumTicketReenvio:function(){
      noTicketreenvio = "";
    },
    putNoTicketReenvio:function(num){
      noTicketreenvio = num;
    },
    getNoTicketReenvio:function(){
      return noTicketreenvio;
    },
    cambiaEstadoFacturacion:function(num){
      estadoFacturacion = num;
    },
    getEstadoFacturacion:function(){
      return estadoFacturacion;
    },
    putpreguntasFrecuentes:function(data){
      preguntasFrecuentes.array.push(data);
    },
    getpreguntasFrecuentes:function(){
      return preguntasFrecuentes.array;
    },
    resetpreguntasFrecuentes:function(){
      preguntasFrecuentes.array.length = 0;
    }
  };

});