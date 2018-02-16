'use strict';

angular.module('starter.pruebajson', [])

.controller('PruebajsonController', function ($scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, CategoriasService, 
											DataLocalService, $window , $ionicSlideBoxDelegate, 
											$mdBottomSheet, $mdToast, ContentProvider, consultaLogin) {
    
    var data = {};
    var band = true;

    $scope.$on('$ionicView.beforeEnter', function(){
        
    });



    $scope.encrypt = function(){
        data.nombre = 'omar';
        data.contra = '123123';
        data.hash1 = '321321';
        data.uuid = '987987987';
        if (band == true) {
            band = false;
            if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
                console.log('!= undefined ::');
                WL.JSONStore.get(DATA_USER_COLLECTION_NAME).add(data).then(function (msg) {
                    console.log('add data ::' + JSON.stringify(msg));
                    band = true;
                }).fail(function (errorObject) {
                    console.log('error add data ::' + JSON.stringify(errorObject));
                    band = true;
                });
            } else {
                console.log('== undefined ::');
                WL.JSONStore.init(collections, optionsIni)
                .then(function () {
                    //handle success
                    WL.JSONStore.get(DATA_USER_COLLECTION_NAME).add(data).then(function (msg) {
                        console.log('add data ::' + JSON.stringify(msg));
                        band = true;
                    }).fail(function (errorObject) {
                        console.log('error add data ::' + JSON.stringify(errorObject));
                        band = true;
                    });
                })
                .fail(function (errorObject) {
                    //handle failure
                    console.log('no function');
                });
            }
        } else {
            console.log('2a');
        }
    }

    $scope.show = function(){
        if (band == true) {
            band = false;
            if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
                console.log('!= undefined ::');
                try{
                    WL.JSONStore.get(DATA_USER_COLLECTION_NAME).findAll(optionsIni).then(function (res) {
                        console.log('show data :: ' + JSON.stringify(res[0].json));
                        band = true;
                    }).fail(function (errorObject) {
                        console.log('show data erroe' + errorObject.msg);
                        band = true;
                    });
                } catch(e) {
                    console.log('error ::' + e);
                    band = true;
                }   
            } else {
                console.log('== undefined ::');
                WL.JSONStore.init(collections, optionsIni)
                .then(function () {
                    //handle success
                    try{
                        WL.JSONStore.get(DATA_USER_COLLECTION_NAME).findAll(optionsIni).then(function (res) {
                            console.log('show data :: ' + JSON.stringify(res));
                            band = true;
                        }).fail(function (errorObject) {
                            console.log('show data erroe' + errorObject.msg);
                            band = true;
                        });
                    } catch(e) {
                        console.log('error ::' + e);
                        band = true;
                    }
                })
                .fail(function (errorObject) {
                    //handle failure
                    console.log('no function');
                });
            }
        } else {
            console.log('2a');
        }
    }

    $scope.remove = function(){
        //consultaLogin.redirecciona();
        
        if (band == true) {
            band = false;
            if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
                console.log('!= undefined ::');
                try {
                    WL.JSONStore.get(DATA_USER_COLLECTION_NAME).removeCollection().then(function () {
                        console.log('la coleccion se ha removido ::');
                        band = true;
                    }).fail(function (errorObject) {
                        console.log('fail de remove ::');
                        band = true;
                    });
                } catch (e) {
                    console.log('error ::' + e);
                    band = true;
                }
            } else {
                console.log('== undefined ::');
                WL.JSONStore.init(collections, optionsIni)
                .then(function () {
                    //handle success
                    try {
                        WL.JSONStore.get(DATA_USER_COLLECTION_NAME).removeCollection().then(function () {
                            console.log('la coleccion se ha removido ::');
                            band = true;
                        }).fail(function (errorObject) {
                            console.log('fail de remove ::');
                            band = true;
                        });
                    } catch (e) {
                        console.log('error ::' + e);
                        band = true;
                    }
                })
                .fail(function (errorObject) {
                    //handle failure
                    console.log('no function');
                });
            }
        } else {
            console.log('2a');
        }
    
    }
    
});