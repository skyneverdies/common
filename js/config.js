
app.config(function($stateProvider, 
                    $urlRouterProvider, 
                    $ionicConfigProvider, 
                    $httpProvider,
                    cfpLoadingBarProvider
                    ) {

    $httpProvider.useApplyAsync(true);
    
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
    //$ionicConfigProvider.backButton.text(' Regresar').icon('ion-chevron-left');
    $ionicConfigProvider.views.swipeBackEnabled(false);

    cfpLoadingBarProvider.autoIncrement = false;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa-spinner">Descargando la revista</div>';

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/plantillas/menu.html',
        controller: 'AppCtrl'
    })
    
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    /*
    .state('cupones', {
        url: '/cupones',
        abstract: true,
        templateUrl: 'views/plantillas/menuCupones.html',
        controller: 'MenuCuponesCtrl'
    })
    */
    .state('app.desctienda', {
        url: '/desctienda',
        views: {
            'menuContent': {
                templateUrl: 'views/cupones/desctienda.html',
                controller: 'DesctiendaController'
            }
        }
    })
       
    .state('app.sucursales', {
        url: '/sucursales',
        views: {
        	'menuContent': {
        		templateUrl: 'views/sucursales/init.html',
                controller: 'InitCtrl'
            },
            'fabContent': {
                template: ''
            }
           
        }
    })
    
    .state('app.search', {
      url: '/search',
      views: {
      	'menuContent': {
              templateUrl: 'views/sucursales/search.html',
              controller: 'SearchCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
    })
    
    .state('app.list', {
      url: '/list/:total/:direccion/:busqueda',
      views: {
      	'menuContent': {
              templateUrl: 'views/sucursales/list.html',
              controller: 'ListCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
    })
    
    .state('app.viewDetalle', {
      url: '/view/:idSucursal',
      views: {
      	'menuContent': {
              templateUrl: 'views/sucursales/view.html',
              controller: 'ViewCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
    })
    
    .state('app.membresias', {
        url: '/membresias',
        views: {
            'menuContent': {
                templateUrl: 'views/membresias/membresias.html',
                controller: 'MembresiasController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.contacto', {
           
        url: '/contacto',
        views: {
            'menuContent': {
                templateUrl: 'views/contacto.html',
                controller: 'VerPortadasController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.anegocio', {
        url: '/anegocio	',
        views: {
            'menuContent': {
                templateUrl: 'views/sucursales/anegocios.html',
                controller: 'SucursalesANController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.tarjetaCredito', {
        url: '/tarjetaCredito',
        views: {
            'menuContent': {
                templateUrl: 'views/tarjetaCredito.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.kirkland', {
        url: '/kirkland',
        views: {
            'menuContent': {
                templateUrl: 'views/kirkland.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.mas', {
        url: '/mas',
        views: {
            'menuContent': {
                templateUrl: 'views/mas/inicio.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
        
    .state('app.aprivacidad', {
        url: '/mas/aprivacidad',
        views: {
            'menuContent': {
                templateUrl: 'views/mas/aprivacidad.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.quienes', {
        url: '/mas/quienes',
        views: {
            'menuContent': {
                templateUrl: 'views/mas/quienes.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.terminos', {
        url: '/mas/terminos',
        views: {
            'menuContent': {
                templateUrl: 'views/mas/terminos.html',
                controller: 'StaticController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.login', {
        url: '/login/login',
        views: {
            'menuContent': {
                templateUrl: 'views/login/login.html',
                controller: 'LoginController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.socio', {
        url: '/login/socio',
        views: {
            'menuContent': {
                templateUrl: 'views/login/socio.html',
                controller: 'SocioController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.islogin', {
        url: '/login/islogin',
        views: {
            'menuContent': {
                controller: 'IsloginController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    
    .state('app.homecc', {
        url: '/cashcard/homecc',
        views: {
            'menuContent': {
                templateUrl: 'views/cashcard/homecc.html',
                controller: 'HomeccController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.recargacc', {
        url: '/cashcard/recargacc',
        views: {
            'menuContent': {
                templateUrl: 'views/cashcard/recargacc.html',
                controller: 'RecargaccController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.pagocc', {
        url: '/cashcard/pagocc',
        views: {
            'menuContent': {
                templateUrl: 'views/cashcard/pagocc.html',
                controller: 'PagoccController'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.registrocc', {
        url: '/cashcard/registrocc',
        views: {
            'menuContent': {
                templateUrl: 'views/cashcard/registrocc.html',
                controller: 'RegistroccController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    /*    
    .state('cashcard', {
        url: '/cashcard',
        abstract: true,
        templateUrl: 'views/plantillas/menucc.html',
        controller: 'CommonCashcardCtrl'
    })

    .state('cashcard.iniciocc', {
        url: '/cashcard/iniciocc',
        views: {
            'ccContent': {
                templateUrl: 'views/cashcard/iniciocc.html',
                controller: 'HomeccController'
            }
        }
    })
    */
    
    .state('app.isregistrocc', {
        url: '/login/islogin',
        views: {
            'menuContent': {
                controller: 'IsRegistroController'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    
    .state('app.ismenuregistrologin', {
       url: '/login/islogin',
       views: {
           'menuContent': {
               controller: 'isMenuRegistroLoginController'
           },
           'fabContent': {
               template: ''
           }
       }
   })

   .state('app.pruebajson', {
       url: '/pruebajson',
       views: {
           'menuContent': {
               templateUrl: 'views/pruebajson.html',
               controller: 'PruebajsonController'
           }
       }
   })

   .state('app.facturacion', {
       url: '/facturacion',
       views: {
           'menuContent': {
               templateUrl: 'views/facturacion/home_facturacion.html',
               controller: 'FacturacionController'
           }
       }
   })
   
   .state('app.preguntasFrecuentes', {
       url: '/preguntasFrecuentes',
       views: {
           'menuContent': {
               templateUrl: 'views/facturacion/preguntas_frecuentes.html',
               controller: 'PreguntasFrecuentes'
           }
       }
   })
  
   .state('app.reenvio', {
       url: '/reenvio',
       views: {
           'menuContent': {
               templateUrl: 'views/facturacion/reenvio_facturacion.html',
               controller: 'ReenvioFacturacionController'
           }
       }
   })

   .state('app.enviaFactura', {
       url: '/enviaFactura',
       views: {
           'menuContent': {
               templateUrl: 'views/facturacion/enviaFactura_facturacion.html',
               controller: 'EnviarFacturaController'
           }
       }
   })
   ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
