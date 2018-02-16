
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var busyIndicator = new WL.BusyIndicator('content');

var app = angular.module('starter',
    ['ionic',
        'angular-svg-round-progress',
        'ionic-material',
        'ionic-modal-select',
        'angular-loading-bar',
        'ngAnimate',
        'ngMaterial',
        'ui.router',
        'starter.anegocios',
        'starter.desctienda',
        'starter.generales',
        'starter.home',
        'starter.membresias',
        'starter.menu',
        //'starter.menucupones',
        'starter.revistas',
        'starter.sucursales',
        'starter.login',
        'starter.islogin',
        'starter.socio',
        'starter.homecc',
        'starter.recargacc',
        'starter.pagocc',
        'starter.registrocc',
        'angular-svg-round-progress',
        'starter.isregistrocc',
        'starter.ismenuregistrologin',
        'starter.facturacion',
        'starter.reenvioFacturacion',
        'starter.enviarFactura',
        'starter.preguntasFrecuentes',
        'starter.pruebajson'
     ]
);

app.run(function ($ionicPlatform, $rootScope, $interval, ContentProvider) {
    
        $ionicPlatform.ready(function () {
            document.addEventListener("deviceready", onDeviceReady, false);
        });

        var estaSincronizado = false;
        var contInvocaciones = 0;
        
        function onDeviceReady() {

            //ionic.Platform.fullScreen(true, false);
            StatusBar.overlaysWebView(false);
            StatusBar.styleDefault();
            //StatusBar.backgroundColorByName("magenta");

            var env = WL.Client.getEnvironment();
            if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
               if (StatusBar.isVisible) {
                    StatusBar.hide();
                    ionic.Platform.fullScreen();
                }
            } else if(env === WL.Environment.ANDROID){
                WL.Logger.debug('$ onDeviceReady el Environment es :: '+env);
            }
            
            //var intervalo = 300000; //5X2x intervalo de tiempo en milisegundos = 10 min
            var intervalo = 20000; //5X2x intervalo de tiempo en milisegundos = 10 min
            var numrepit = 2160; //cada 10 minutos equivale a 15 dias
            $interval(callGetState, intervalo, numrepit);
        }

    
        function callGetState() {
            //WL.Logger.debug('$$$$$  app.run GetState ContentProvider.getStateSinc :: '+ContentProvider.getStateSinc() );
            try{
                if(ContentProvider.getStateSinc() != "EJECUTANDO"){
                    if (estaSincronizado){
                        WL.Logger.debug('$$$$$  app.run callGetState... Esta sincronizando. ');
                        estaSincronizado = false;
                    }else{
                        WL.Device.getNetworkInfo(getNetworkInfoCallback);
                        WL.Logger.debug('$$$$$  app.run Invoca a ContentProvider :: Sincronizar de contenido ');
                        estaSincronizado = true;
                    }
                }else {
                    WL.Logger.debug('$$$$$  app.run callGetState EJECUTANDO sync Esperar :: ');
                }
            }catch (error) {
                WL.Logger.error("Error en  app.run callGetState. "+ error.message);
                return;
            }
        }


        function getNetworkInfoCallback(info) {
            try{
                if (info.isNetworkConnected == true || info.isNetworkConnected == 'true') {
                        WL.Logger.debug('$$$$$  app.run isNetworkConnected :: onDeviceReady :: contInvocaciones :: '+contInvocaciones);
                        ContentProvider.validaFechasVecimiento();

                }else{
                    if(contInvocaciones < 1){
                        navigator.globalization.getPreferredLanguage(
                            function (language) {
                                var title     = 'Advertencia';
                                var template  = 'No cuenta con señal a Internet, la información mostrada puede no ser la más reciente.';
                                var btn1      = 'Aceptar';
                                if (language.value == 'en-US' || language.value == 'en-MX' 
                                    || language.value == 'english' || language.value == 'ingles' ){
                                        
                                    title     = "Warning";
                                    template  = "No signal Internet, the information shown may not be the most recent.";
                                    btn1      = "Accept";
                                }
                                
                                WL.SimpleDialog.show(title, template, [
                                    {   text : btn1, handler : function() { }
                                    }
                                ]);
                            },
                            function () {
                                WL.Logger.debug("can't get language");
                            }
                        );

                    }
                }
                contInvocaciones++;

            }catch (error) {
                WL.Logger.error("Error en  app.run callGetState. "+ error.message);
                return;
            }
        }
        

});

app.filter('escape', function () {
    return window.encodeURIComponent;
});

app.factory("busyIndicator", function () {
    return busyIndicator;
}
);
