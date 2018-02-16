'use strict';

angular.module('starter.islogin', [])

    .controller('IsloginController', function ($scope, $stateParams, $timeout, $state, $http, $ionicPopup, consultaLogin) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        //alert("Llamo a contorlador de login");

        //aqui va a verificar que el usuario ya inicio la sesion
        var dataServices;
        $scope.datosServicio;

        dataServices = localStorage.getItem('dataService') || '';

        if (dataServices.length != 0) {
            $scope.datosServicio = JSON.parse(dataServices);
        } else {
            $state.go('app.login');
        }
        
        if (dataServices == '' || $scope.datosServicio.validated != 'OK') {
        	$state.go('app.login');
        } else {
            $state.go('app.socio');
                navigator.globalization.getPreferredLanguage(
                function (language) {
                    var title     = 'Mi cuenta';
                    var template  = '¿Cerrar sesión?';
                    var btn1      = 'Aceptar';
                    var btn2      = 'Cancelar';
                    if (language.value == 'en-US' || language.value == 'en-MX' 
                        || language.value == 'english' || language.value == 'ingles' ){
                            
                        title     = 'My account';
                        template  = 'Close session?';
                        btn1      = 'Accept';
                        btn2      = 'Cancel';
                    }
                    WL.SimpleDialog.show(title, template, [
                        {
                            text : btn1,
                            handler : function() {
                                busyIndicator.show();
                                consultaLogin.remove();
                                /*
                                localStorage.removeItem('prmAmountBalance');
                                localStorage.removeItem('prmAmountBalanceFmt');
                                localStorage.removeItem('fechaUltimaActualizacion');
                                localStorage.removeItem('consulta.prmStatus');
                                localStorage.removeItem('prmCashCardNumber');
                                localStorage.removeItem('vincula.prmStatus');
                                localStorage.removeItem('prmOrderId');
                                localStorage.removeItem('dataUser');
                                localStorage.removeItem('dataService');
                                localStorage.removeItem('cards');
                                localStorage.removeItem('desvincula.prmStatus');
                                localStorage.removeItem('prmTrxId');
                                */
                                busyIndicator.hide();
                                //$state.go('app.home');
                            }
                        },
                        {
                            text : btn2,
                            handler : function(){                               
                                //dataServices = localStorage.getItem('dataService') || '<empty>';
                                console.log('dataServices es ::' + dataServices);                                
                                if (dataServices == '') {
                                     $state.go('app.home');
                                 } else {
                                     $state.go('app.socio');
                                 }
                            }
                        }
                    ]);
                    },
                    function () {
                    WL.Logger.debug("can't get language");
                    }
            );
        }

    })
;