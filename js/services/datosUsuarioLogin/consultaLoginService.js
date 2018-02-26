app.factory("consultaLogin", function($state, $http)
{ 
  //var jsonRegistro={"returnCode":0,"array": []};

  var dataUser = {};
  var temp;
  var temporal;
  var band = true;
 				
  return{
   	consulta:function(uuid, dir){
   		if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
          console.log('!= undefined ::');
          try{
              WL.JSONStore.get(DATA_USER_COLLECTION_NAME).findAll(optionsIni).then(function (res) {
                  //console.log('show data :: ' + JSON.stringify(res[0].json));
                  dataUser = res[0].json;
                  consultaServicio(uuid, dir);
              }).fail(function (errorObject) {
                  console.log('show data erroe' + errorObject.msg);
              });
          } catch(e) {
              console.log('error ::' + e);
          }   
      } else {
          console.log('== undefined ::');
          WL.JSONStore.init(collections, optionsIni)
          .then(function () {
              //handle success
              try{
                  WL.JSONStore.get(DATA_USER_COLLECTION_NAME).findAll(optionsIni).then(function (res) {
                      //console.log('show data :: ' + JSON.stringify(res));
                      dataUser = res[0].json;
                      consultaServicio(uuid, dir);
                  }).fail(function (errorObject) {
                      console.log('show data erroe' + errorObject.msg);
                  });
              } catch(e) {
                  console.log('error ::' + e);
              }
          })
          .fail(function (errorObject) {
              //handle failure
              console.log('no function');
          });
      }
      //return 0;
    },
    remove:function(){
      removeDataUser();
      //return 0;
    }
  };

  function consultaServicio(uuid, dir){
    //$http.get('https://wwwqa.costco.com.mx/wps/eMobile/service/authentication?email=' + dataUser.email + '&password=' + dataUser.pass + '&vartemp=' + dataUser.vartemp + '&ouid=' + uuid)
    $http.get("https://"+ambiente+".costco.com.mx/wps/eMobile/service/authentication?email=" + dataUser.email + "&password=" + dataUser.pass + "&vartemp=" + dataUser.vartemp + "&ouid=" + uuid, {timeout: 6000})
      .success(function(data){
          busyIndicator.hide();
          console.log('los datos son validateddddddddd::' + JSON.stringify(data.validated));
          //localStorage.setItem("dataService", JSON.stringify(data));
          if (data.validated != "OK") {
              console.log('se volvio a consultar el servicio sin exito::');
              removeDataUser();
          } else {
              console.log('Se volvio a consultar el servicio con exito::');
              switch(dir){
                case 1  : 
                  $state.go('app.socio');
                  break;
                case 2  :
                  $state.go('app.isregistrocc');
                  break;
                default :
                  console.log('opcion no valida');
                  break;
              }
          }
      })
      .error(function(data){
          busyIndicator.hide();
          console.log('sin respuesta del servidor');
          switch(dir){
            case 1  : 
              $state.go('app.socio');
              break;
            case 2  :
              var edo = localStorage.getItem('prmCashCardNumber') || '';
              if (edo == '') {
                $state.go('app.socio');
                WL.SimpleDialog.show("Advertencia", "No pudimos completar esta acción, inténtalo de nuevo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
              } else {
                $state.go('app.isregistrocc');
              }
              break;
            default :
              console.log('opcion no valida');
              break;
          }
      });
  }

  function removeDataUser(){
    if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
        console.log('!= undefined ::');
        try {
            WL.JSONStore.get(DATA_USER_COLLECTION_NAME).removeCollection().then(function () {
                console.log('la coleccion se ha removido ::');
                localStorage.removeItem('prmAmountBalance');
                localStorage.removeItem('prmAmountBalanceFmt');
                localStorage.removeItem('fechaUltimaActualizacion');
                localStorage.removeItem('consulta.prmStatus');
                localStorage.removeItem('prmCashCardNumber');
                localStorage.removeItem('vincula.prmStatus');
                localStorage.removeItem('prmOrderId');
                //localStorage.removeItem('dataUser');
                localStorage.removeItem('dataService');
                localStorage.removeItem('cards');
                localStorage.removeItem('desvincula.prmStatus');
                localStorage.removeItem('prmTrxId');
                $state.go('app.login');
            }).fail(function (errorObject) {
                console.log('fail de remove ::');
            });
        } catch (e) {
            console.log('error ::' + e);
        }
    } else {
        console.log('== undefined ::');
        WL.JSONStore.init(collections, optionsIni)
        .then(function () {
            //handle success
            try {
                WL.JSONStore.get(DATA_USER_COLLECTION_NAME).removeCollection().then(function () {
                    console.log('la coleccion se ha removido ::');
                    localStorage.removeItem('prmAmountBalance');
                    localStorage.removeItem('prmAmountBalanceFmt');
                    localStorage.removeItem('fechaUltimaActualizacion');
                    localStorage.removeItem('consulta.prmStatus');
                    localStorage.removeItem('prmCashCardNumber');
                    localStorage.removeItem('vincula.prmStatus');
                    localStorage.removeItem('prmOrderId');
                    //localStorage.removeItem('dataUser');
                    localStorage.removeItem('dataService');
                    localStorage.removeItem('cards');
                    localStorage.removeItem('desvincula.prmStatus');
                    localStorage.removeItem('prmTrxId');
                    $state.go('app.login');
                }).fail(function (errorObject) {
                    console.log('fail de remove ::');
                });
            } catch (e) {
                console.log('error ::' + e);
            }
        })
        .fail(function (errorObject) {
            //handle failure
            console.log('no function');
        });
    }
  }

});