/* */
app.factory("ContentProvider", function() {
  
	var VERSIONES_COLLECTION_NAME = 'versiones',
		VERSIONES_COLL_LOCALES = 'versionesLocal',
		HOME_COLLECTION_NAME = 'home',
		CONTACTO_COLLECTION_NAME = 'contacto',
		SUCURSALES_COLLECTION_NAME = 'sucursales',
		DESCBANNER_COLLECTION_NAME = 'descbanner',
		CATEGORIAS_COLLECTION_NAME = 'categoriasdesc',
		CATEGORIAS_COLL_LOCAL = 'categoriasLocalVersion',
		CUPONES_COLLECTION_NAME = 'cupones';

	var mapColecciones = {
							0 : HOME_COLLECTION_NAME,
							1 : SUCURSALES_COLLECTION_NAME,
							2 : CONTACTO_COLLECTION_NAME,
							3 : DESCBANNER_COLLECTION_NAME,
							4 : CATEGORIAS_COLLECTION_NAME,
							5 : CUPONES_COLLECTION_NAME
						};
	var unMapColecciones = {
				"HOME_BANNER" : 0,
				"SUCURSALES" : 1,
				"CONTACTO" : 2,
				"DESC_BANNER" : 3,
				"CATEGORIAS" : 4,
				"CUPONES" : 5
			};

	var unMapSeccionCollIdPosicion = {
				HOME_COLLECTION_NAME: 0,
				SUCURSALES_COLLECTION_NAME: 1,
				CONTACTO_COLLECTION_NAME: 2,
				DESCBANNER_COLLECTION_NAME: 3,
				CATEGORIAS_COLLECTION_NAME : 5
			};

	var mapStatesSinc = {
						0 : "INICIO",
						1 : "EJECUTANDO",
						2 : "COMPLETADO",
						3 : "SIN_CAMBIOS"
					};

	var stateCP = mapStatesSinc[0];

	var collections = {},
		optionsIni = {},
		searchFieldsDataUser = {'email'		: 'string',
								'vartemp' 	: 'string',
								'pass'		: 'string',
								'terminos' 	: 'string'},
		searchFields = {'name': 'string'};
	var optionsReplace = {
							push: true
						};
	var addOptions = {};

	// Object that defines all the collections
	var collectionsDesc = {};
	var versionesLocal = [];
	var versionesServer = [];
	var categoriasLocales = [];
	var categoriasNuevas = [];
	var idsColLocalVersions = [];
	var contCargaCuponesSucess = 0;
	var numCategorias= 0;

	collections[DATA_USER_COLLECTION_NAME]= {};
	collections[DATA_USER_COLLECTION_NAME].searchFields= searchFieldsDataUser;

	collections[VERSIONES_COLL_LOCALES]= {};
	collections[VERSIONES_COLL_LOCALES].searchFields= searchFields;

	collections[VERSIONES_COLLECTION_NAME]= {};
	collections[VERSIONES_COLLECTION_NAME].searchFields= searchFields;
	collections[VERSIONES_COLLECTION_NAME].adapter = getAdapter(VERSIONES_COLLECTION_NAME, 22000);
	
	collections[HOME_COLLECTION_NAME]= {};
	collections[HOME_COLLECTION_NAME].searchFields= searchFields;
	collections[HOME_COLLECTION_NAME].adapter = getAdapter(HOME_COLLECTION_NAME, 32000);

	collections[CONTACTO_COLLECTION_NAME]= {};
	collections[CONTACTO_COLLECTION_NAME].searchFields= searchFields;
	collections[CONTACTO_COLLECTION_NAME].adapter = getAdapter(CONTACTO_COLLECTION_NAME, 26000);

	collections[SUCURSALES_COLLECTION_NAME]= {};
	collections[SUCURSALES_COLLECTION_NAME].searchFields= searchFields;
	//collections[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

	collections[DESCBANNER_COLLECTION_NAME]= {};
	collections[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
	collections[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
	
	collections[CATEGORIAS_COLLECTION_NAME]= {};
	collections[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
	collections[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);

	//optionsIni.password = 'Costco01';
    optionsIni.localKeyGen = false;
    optionsIni.clear = true;


  return {
    data: {},

	getStateSinc: function () {
		var tempState = stateCP;
		return tempState;
	},

	validaFechasVecimiento: function () {
			WL.Logger.debug("##### validaFechasVecimiento...: ");
			versionesLocal = [];
			
			if(idsColLocalVersions.length > 0){
				idsColLocalVersions.splice(0, idsColLocalVersions.length);
			}
			if(categoriasLocales.length > 0){
				categoriasLocales.splice(0, categoriasLocales.length);
			}
			if(categoriasNuevas.length > 0){
				categoriasNuevas.splice(0, categoriasNuevas.length);
			}
			if(versionesLocal.length > 0){
				versionesLocal.splice(0, versionesLocal.length);
			}
			
			WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll()
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined){
						if(arrayResults.length > 0){
							for(i=0; i < arrayResults.length; i++){
								versionesLocal[i] = arrayResults[i].json;
								idsColLocalVersions[i] = arrayResults[i]._id;
							}
							return versionesLocal;
						}else{
							WL.Logger.debug(" validaFechasVecimiento :: Esta en modo offline y/o no hay documentos en coleccion de versiones en local :: ");
							return versionesLocal;
						}
					}else{
						WL.Logger.debug(" validaFechasVecimiento:: Realizo primer arranque en modo offline, no hay colecciones cargadas :: ");
						return versionesLocal;
					}
				}catch (error) {
					WL.Logger.error("Error en validaFechasVecimiento. La consulta de versiones locales no pudo ser concluida. "+ error.message);
					return versionesLocal;
				}
				
			})
			.then(function (versionesLocal) {
				//Si es primer arranque y no hay comunicacion con el servidor 
				// entonces puede iniciar con Fail decarga de versiones
				try{
					var sincrinizarContenidos = false;
					var dateNow = new Date();

					if(versionesLocal.length > 0){
						WL.Logger.debug('### validaFechasVecimiento :: versionesLocal.length:: '+ versionesLocal.length );
						
						for(i=0; i < versionesLocal.length; i++){
							var fvencimiento = versionesLocal[i].fvencimiento;
							var nameCollecctionSec = versionesLocal[i].name;

							//WL.Logger.debug('### validaFechasVecimiento :: '+i+' fvencimiento:: '+ fvencimiento);
							dateVencmto = new Date(fvencimiento);
							//WL.Logger.debug('### validaFechasVecimiento :: '+i+' dateVencmto:: '+ dateVencmto);

							if (dateNow >= dateVencmto){
								WL.Logger.debug(':: Expiro la coleccion:: '+ nameCollecctionSec);
								sincrinizarContenidos = true;
							}else{
								//WL.Logger.debug('### validaFechasVecimiento ::'+i+' :: Sige Vigente'+ dateVencmto.toISOString() );
							}
						}
					}else{
						WL.Logger.debug(" validaFechasVecimiento :: Arranco en modo offline y/o no hay documentos en coleccion de versiones en local :: ");
						sincrinizarContenidos = true;
					}

					if (sincrinizarContenidos){
						WL.Logger.debug('### sincrinizarContenidos :: '+sincrinizarContenidos);
						stateCP = mapStatesSinc[1];
						procesaColecciones(versionesLocal, idsColLocalVersions);
					}else{
						stateCP = mapStatesSinc[3];
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el validaFechasVecimiento. La consulta de versiones del servdor no pudo ser concluida. "+ error.message);
					stateCP = mapStatesSinc[3];
					return;
				}
			})
			.fail(function (errorObject) {
					WL.Logger.ctx({ pretty: true }).error(errorObject);
					WL.Logger.error("Error en la carga de contenidos error code:: "+errorObject.err);
					WL.Logger.error("Error On JSONStore errorObject.col :: " +errorObject.col);
					if( ( errorObject.err != undefined ) && ( errorObject.err < 0)  )
					{
							WL.Logger.debug("Falla sincroniza contenidos...");
					}else{
					}
					stateCP = mapStatesSinc[3];
			});
	}, //Fin validaFechasVecimiento

	
	runSincronizaContenido: function () {
			WL.Logger.debug("##### runSincronizaContenido...: ");
			versionesLocal = [];
			//var versionesServer = [];
			
			WL.JSONStore.get(VERSIONES_COLLECTION_NAME).findAll()
			.then(function (arrayResults) {
				try{
					stateCP = mapStatesSinc[1];
					if(arrayResults != undefined){
						WL.Logger.debug("# runSincronizaContenido :: Num Versiones en Local :: "+arrayResults.length);
						if(arrayResults.length > 0){
							for(i=0; i < arrayResults.length; i++){
								versionesLocal[i] = arrayResults[i].json;
							}							
						}else{
							WL.Logger.debug(" runSincronizaContenido :: Esta en modo offline y/o no hay documentos en coleccion de versiones en local :: ");
						}
					}else{
						WL.Logger.debug(" runSincronizaContenido:: Es primera carga porque no hay resultados de la consulta de coleccion de versiones en local  :: ");
					}
					procesaColecciones(versionesLocal);
				}catch (error) {
					stateCP = mapStatesSinc[3];
					WL.Logger.error("Error en runSincronizaContenido. La consulta de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.fail(function (errorObject) {
					WL.Logger.ctx({ pretty: true }).error(errorObject);
					WL.Logger.error("Error en la carga de contenidos error code:: "+errorObject.err);
					WL.Logger.error("Error On JSONStore errorObject.col :: " +errorObject.col);
					if( ( errorObject.err != undefined ) && ( errorObject.err < 0)  )
					{
						WL.Logger.debug("Falla sincroniza contenidos...");
					}else{

					}
					stateCP = mapStatesSinc[3];

			});
	},

  };


	function getAdapter(param, timeOut){
		param = 'v1.1/'+param;
		var adapter =  {
				name: 'DatosApp',
				load: {
					procedure: 'getMainDataApp',
					params: [param],
					key: 'array',
					compressResponse: true
				},
				accept: function (data) {
					return (data.status === 200);
				},
				timeout: timeOut
			};
		return adapter;
	}

	function loadCuponesSuccess(result){
			if (result.invocationResult.array.length > 0){
				WL.Logger.debug("runSincronizaColeccion loadCuponesSuccess result.invocationResult.array total de cupones::::: " + result.invocationResult.array.length);
				
				var sigCategoria = result.invocationResult.array[0].categoria

				WL.JSONStore.get(sigCategoria).add(result.invocationResult.array, addOptions)
				.then(function () {
					contCargaCuponesSucess++;					
					WL.Logger.debug("runSincronizaColeccion loadCuponesSuccess true, Se ha agregado contenido a la colecccion::  " + sigCategoria );
					try{
						if(contCargaCuponesSucess == numCategorias){
							WL.Logger.debug('# procesaColecciones :: CUPONES_COLLECTION_NAME actualizado:: ' );
							if (idsColLocalVersions.length > 0){
								id_doc = idsColLocalVersions[4];
								json_col = versionesServer[4];
								
								var doc = {_id: id_doc, json: json_col };
								WL.Logger.debug("Doc for versiones colecction de CUPONES_COLLECTION_NAME :: " + JSON.stringify(doc));

								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
							}else {
								WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
								return;
							}
						}
						else {
							WL.Logger.debug("LA COLECCION CUPONES_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
							return;
						}
					}catch (error) {
						WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para CUPONES_COLLECTION_NAME no pudo ser concluida. "+ error.message);
						return;
					}
				})
				.fail(function (errorObject) {
					WL.Logger.error("runSincronizaColeccion loadCuponesSuccess falla NO se agregaron contenidos a la coleccion "+sigCategoria);
					WL.Logger.ctx({ pretty: true }).error(errorObject);
				});
			}
	};

	function loadCuponesFailure(result){
			WL.Logger.error("runSincronizaColeccion FAllA loadCuponesFailure Cupones retrieve Fail ....................");
	};

	function procesaColecciones(versionesLocal, idsColLocalVersions){
		var esPrimeraCarga = false;
		var recargaCategorias= false;

		if(versionesServer.length > 0){
			versionesServer.splice(0, versionesServer.length);
		}
		
		if(versionesLocal.length == 0){
			WL.Logger.debug("procesaColecciones :: PRIMERA CARGA DE COLECCIONES... ");
			esPrimeraCarga = true;
		}else{
			esPrimeraCarga = false;
		}

		WL.JSONStore.get(VERSIONES_COLLECTION_NAME).clear()
			.then(function () {
				try{
					return WL.JSONStore.get(VERSIONES_COLLECTION_NAME).load();
				}catch (error) {
					WL.Logger.error("Error en el arranque. La consulta de versiones locales no pudo ser concluida. Inica la APP en modo Offline "+ error.message);
				}
			})
			.then(function () {
				try{
					return WL.JSONStore.get(VERSIONES_COLLECTION_NAME).findAll();
				}catch (error) {
					WL.Logger.error("Error en el arranque. La consulta de versiones locales no pudo ser concluida. Inica la APP en modo Offline "+ error.message);
				}
			})
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined && arrayResults.length > 0){
						WL.Logger.debug("### Num Versiones en Server :: "+arrayResults.length);
						for(i=0; i < arrayResults.length; i++){
							versionesServer[i] = arrayResults[i].json;
							var arrayJson = arrayResults[i].json;
							if(esPrimeraCarga){
								versionesLocal[i] = arrayJson;
								versionesLocal[i].version = 0;
							}
						}
						if(esPrimeraCarga){
							WL.Logger.debug("### Agrega Versiones 0 de versiones del Servidor a VERSIONES_COLL_LOCALES :: "+JSON.stringify(versionesLocal) );
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).add(versionesLocal, addOptions);
						}else{
							WL.Logger.debug('Carga inicial de Versiones Servidor. ');
							return;
						}
					}else{
						return;
					}	
				}catch (error) {
					WL.Logger.error("Error en el arranque. La consulta de versiones locales no pudo ser concluida. Inica la APP en modo Offline "+ error.message);
				}
			})
			.then(function () {				
				try{
					if(esPrimeraCarga){
						WL.Logger.debug('Consulta versiones Local para obtener Id de primer carga de contenidos. ');
						return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
					}else{
						WL.Logger.debug('No es primer carga de contenidos :: Comprobar versiones de cada colección:: ');
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La segunda consulta de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined && arrayResults.length > 0){
						if(idsColLocalVersions.length > 0){
							idsColLocalVersions.splice(0, idsColLocalVersions.length);
						}
						for(i=0; i < arrayResults.length; i++){
							idsColLocalVersions[i] = arrayResults[i]._id;
						}
					}
					return;
				}catch (error) {
					WL.Logger.error("Error en el arranque. La segunda consulta de Ids de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					WL.Logger.debug("### Versiones en Local 0 :: "+JSON.stringify(versionesLocal[0].version) );
					WL.Logger.debug("### Versiones en Server 0 :: "+JSON.stringify(versionesServer[0].version ) );

					if(versionesServer[0].version != versionesLocal[0].version) {
						WL.Logger.debug(" LIMPIAR COLECCION HOME_COLLECTION_NAME :: ");
						return WL.JSONStore.get(HOME_COLLECTION_NAME).clear();
					}else {
						WL.Logger.debug(" NO REQUIERE LIMPIAR COLECCION HOME_COLLECTION_NAME :: ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de HOME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[0].version != versionesLocal[0].version) ){
						WL.Logger.debug(" ACTUALIZAR COLECCION HOME_COLLECTION_NAME :: ");
						return WL.JSONStore.get(HOME_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LA COLECCION HOME_COLLECTION_NAME NO REQUIERE ACTUALIZARSE:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de HOME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[0].version != versionesLocal[0].version) ){
						WL.Logger.debug('# procesaColecciones :: HOME_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[0];
							json_col = versionesServer[0];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de HOME_COLLECTION_NAME :: " + JSON.stringify(doc));
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
							return;
						}
					}else {
						WL.Logger.debug("LA COLECCION HOME_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para HOME_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (numberOfDocumentsReplaced) {
				try{
					if(versionesServer[3].version != versionesLocal[3].version) {
						WL.Logger.debug("LIMPIAR COLECCION DESCBANNER_COLLECTION_NAME :: ");
						return WL.JSONStore.get(DESCBANNER_COLLECTION_NAME).clear();
					}else {
						WL.Logger.debug(" COLECCION DESCBANNER_COLLECTION_NAME :: no se necesita limpiar ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos del Banner de desc no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[3].version != versionesLocal[3].version) ){
						WL.Logger.debug("ACTUALIZAR LA COLECCION DESCBANNER_COLLECTION_NAME :: ");
						return WL.JSONStore.get(DESCBANNER_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LA COLECCION DESCBANNER_COLLECTION_NAME NO REQUIERE ACTUALIZARSE:: ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos del Banner de desc no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[3].version != versionesLocal[3].version) ){
						WL.Logger.debug('# procesaColecciones :: DESCBANNER_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[3];
							json_col = versionesServer[3];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de DESCBANNER_COLLECTION_NAME :: " + JSON.stringify(doc));
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
							return;
						}
					}else {
						WL.Logger.debug("LA COLECCION DESCBANNER_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para DESCBANNER_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (responseFromEndpoint) {
				try{
					//LEER CATEGORIAS ANTES DE BORRAR
					WL.Logger.debug("LA COLECCION CATEGORIAS_COLLECTION_NAME :: CONSULTA DE CATEGORIAS ");
					return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).findAll();
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (result) {
				try{
					if(result != undefined && result.length == 0){
						recargaCategorias = true;
					}else{
						numCategorias = result.length;
						recargaCategorias= false;
					}

					if( recargaCategorias ) {
						WL.Logger.debug("CARGA LA COLECCION CATEGORIAS_COLLECTION_NAME :: ");
						return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LAS COLECCIONES DE  CUPONES DEBEN INICIARSE :: ");
						if(result != undefined && result.length > 0){
							WL.Logger.debug("INICIAR COLECCIONES DE CUPONES ...para las . "+result.length +" categorias existentes ");
							
							for(i=0; i < result.length; i++){
								//WL.Logger.debug("Documento de Categorias  JSON.stringify :: "+JSON.stringify(arrayResults[i].json));
								var sigCategoria = result[i].json;

								collectionsDesc[sigCategoria.name]= {};
								collectionsDesc[sigCategoria.name].searchFields= searchFields;
							}
							WL.Logger.debug("INICIAR OTRAS COLECCIONES DEL CONTENIDO... ");

							/* Obtenemos las colecciones anteriores para inicializar todas nuevamente 
							*/
							collectionsDesc[VERSIONES_COLL_LOCALES]= {};
							collectionsDesc[VERSIONES_COLL_LOCALES].searchFields= searchFields;

							collectionsDesc[VERSIONES_COLLECTION_NAME]= {};
							collectionsDesc[VERSIONES_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[VERSIONES_COLLECTION_NAME].adapter = getAdapter(VERSIONES_COLLECTION_NAME, 22000);
							
							collectionsDesc[HOME_COLLECTION_NAME]= {};
							collectionsDesc[HOME_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[HOME_COLLECTION_NAME].adapter = getAdapter(HOME_COLLECTION_NAME, 32000);

							collectionsDesc[CONTACTO_COLLECTION_NAME]= {};
							collectionsDesc[CONTACTO_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[CONTACTO_COLLECTION_NAME].adapter = getAdapter(CONTACTO_COLLECTION_NAME, 26000);

							collectionsDesc[SUCURSALES_COLLECTION_NAME]= {};
							collectionsDesc[SUCURSALES_COLLECTION_NAME].searchFields= searchFields;
							//collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

							collectionsDesc[DESCBANNER_COLLECTION_NAME]= {};
							collectionsDesc[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
							
							collectionsDesc[CATEGORIAS_COLLECTION_NAME]= {};
							collectionsDesc[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);
							
							return WL.JSONStore.init(collectionsDesc, optionsIni);
						}
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					//Cuando las categorias fueron cargadas por primera ves
					if(recargaCategorias){
						WL.Logger.debug('# procesaColecciones :: CATEGORIAS_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[4];
							json_col = versionesServer[4];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de CATEGORIAS_COLLECTION_NAME :: " + JSON.stringify(doc));

							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: Obtiene los ids de Version local");
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
						}
					}else {
						WL.Logger.debug("LA COLECCION CATEGORIAS_COLLECTION_NAME NO FUE ACTUALIZADA::");
						WL.Logger.debug("Las colecciones fueron re-inicializadas entonce recupera nuevamente Ids ");
						return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para CATEGORIAS_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined && arrayResults.length > 0){
						if(idsColLocalVersions.length > 0){
							idsColLocalVersions.splice(0, idsColLocalVersions.length);
						}
						for(i=0; i < arrayResults.length; i++){
							idsColLocalVersions[i] = arrayResults[i]._id;
						}
					}
					return;
				}catch (error) {
					WL.Logger.error("Error en el arranque. La tercera consulta de Ids de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || recargaCategorias || 
						( versionesServer[5].version != versionesLocal[5].version) ) {
						WL.Logger.debug(" PROCESAR CUPONES DE LAS CATEGORIAS CARGADAS POR PRIMERA OCACION :: o QUE DEBEN SER ACTUALIZADAS ::");
						return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).findAll();
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CUPONES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {	
				try{
					if( versionesServer[5].version != versionesLocal[5].version ){
						if(arrayResults != undefined && arrayResults.length > 0){
							WL.Logger.debug("BORRAR CUPONES ...para las . "+arrayResults.length +" categorias");
							numCategorias = arrayResults.length;
							for(i=0; i < arrayResults.length; i++){
								var sigCategoria = arrayResults[i].json;

								if (WL.JSONStore.get(sigCategoria.name) != undefined){
									WL.Logger.debug("LIMPIAR contenido de cupones de la categoria existente.....  "+sigCategoria.name);
									WL.JSONStore.get(sigCategoria.name).clear();
								}
							}
						}
					}else{
						if( esPrimeraCarga || recargaCategorias ){
							if(arrayResults != undefined && arrayResults.length > 0){
								WL.Logger.debug("INICIAR COLECCIONES DE CUPONES ...para las . "+arrayResults.length +" categorias");
								categoriasNuevas = [];
								for(i=0; i < arrayResults.length; i++){
									//WL.Logger.debug("Documento de Categorias  JSON.stringify :: "+JSON.stringify(arrayResults[i].json));
									categoriasNuevas[i] = arrayResults[i].json;
									var sigCategoria = arrayResults[i].json;

									collectionsDesc[sigCategoria.name]= {};
									collectionsDesc[sigCategoria.name].searchFields= searchFields;
								}
								WL.Logger.debug("antes de iniciar las colecciones  hay..... "+ categoriasNuevas.length+" categorias nuevas");
								/* Obtenemos las colecciones anteriores para inicializar todas nuevamente 
								*/
								WL.Logger.debug("AGREGAR LAS COLECCIONES QUE NO SON DE CUPONES PARA INICIARLAS NUEVAMENTE " );

								collectionsDesc[VERSIONES_COLL_LOCALES]= {};
								collectionsDesc[VERSIONES_COLL_LOCALES].searchFields= searchFields;

								collectionsDesc[VERSIONES_COLLECTION_NAME]= {};
								collectionsDesc[VERSIONES_COLLECTION_NAME].searchFields= searchFields;
								collectionsDesc[VERSIONES_COLLECTION_NAME].adapter = getAdapter(VERSIONES_COLLECTION_NAME, 22000);
								
								collectionsDesc[HOME_COLLECTION_NAME]= {};
								collectionsDesc[HOME_COLLECTION_NAME].searchFields= searchFields;
								collectionsDesc[HOME_COLLECTION_NAME].adapter = getAdapter(HOME_COLLECTION_NAME, 32000);

								collectionsDesc[CONTACTO_COLLECTION_NAME]= {};
								collectionsDesc[CONTACTO_COLLECTION_NAME].searchFields= searchFields;
								collectionsDesc[CONTACTO_COLLECTION_NAME].adapter = getAdapter(CONTACTO_COLLECTION_NAME, 26000);

								collectionsDesc[SUCURSALES_COLLECTION_NAME]= {};
								collectionsDesc[SUCURSALES_COLLECTION_NAME].searchFields= searchFields;
								//collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

								collectionsDesc[DESCBANNER_COLLECTION_NAME]= {};
								collectionsDesc[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
								collectionsDesc[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
								
								collectionsDesc[CATEGORIAS_COLLECTION_NAME]= {};
								collectionsDesc[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
								collectionsDesc[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);
								
								return WL.JSONStore.init(collectionsDesc, optionsIni);
							}
						}else {
							WL.Logger.debug("Las Colecciones fueron reiniciadas o los cupones borrados:: CONTINUA");
							return;
						}
					}
				}catch (error) {
					WL.Logger.error("Error al inicar las colecciones de cupones. La sincronizacion de recursos de CUPONES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {				
				try{
					if( esPrimeraCarga || recargaCategorias ){
						WL.Logger.debug('obten la coleccion de VERSIONES_COLL_LOCALES para recuperar nuevos Ids. ');
						return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
					}else{
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La cuarta consulta de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined && arrayResults.length > 0){
						WL.Logger.debug('Asigna nuevos Ids a idsColLocalVersions. ');
						if(idsColLocalVersions.length > 0){
							idsColLocalVersions.splice(0, idsColLocalVersions.length);
						}
						for(i=0; i < arrayResults.length; i++){
							idsColLocalVersions[i] = arrayResults[i]._id;
						}
					}
					return;
				}catch (error) {
					WL.Logger.error("Error en el arranque. La cuarta consulta de Ids de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {		
				try{
					if( esPrimeraCarga || recargaCategorias ){
						if(categoriasNuevas != undefined && categoriasNuevas.length > 0){
							WL.Logger.debug("Hay..... "+ categoriasNuevas.length+" categorias nuevas. en primera carga:: ");
							numCategorias = categoriasNuevas.length;
							for(i=0; i < categoriasNuevas.length; i++){
								var sigCategoria = categoriasNuevas[i];

								WL.Logger.debug("categoriasNuevas JSON.stringify sigCategoria :: "+sigCategoria.name);
								var invocationData = {
									adapter : 'DatosApp',
									procedure : 'getMainDataApp',
									parameters : ["v1.1/cupones/"+sigCategoria.name]
								};
								var options = {
									onSuccess : loadCuponesSuccess,
									onFailure : loadCuponesFailure,
									invocationContext: {}
								};
								WL.Client.invokeProcedure(invocationData, options);
							}
						}
					}else {
						if(versionesServer[4].version != versionesLocal[4].version){
							WL.Logger.debug(" LIMPIAR COLECCION DE CATEGORIAS_COLLECTION_NAME :: ");
							return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).clear();
						}else{
							return;
						}
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CUPONES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if(versionesServer[4].version != versionesLocal[4].version){
						WL.Logger.debug(" CARGA NUEVAS COLECCION DE CATEGORIAS_COLLECTION_NAME :: Arranca la APP ");
						return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).load();
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if(versionesServer[4].version != versionesLocal[4].version){
						WL.Logger.debug('# procesaColecciones :: CATEGORIAS_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[4];
							json_col = versionesServer[4];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de CATEGORIAS_COLLECTION_NAME :: " + JSON.stringify(doc));
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
							return;
						}
					}else {
						WL.Logger.debug("LA COLECCION CATEGORIAS_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para CATEGORIAS_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( versionesServer[5].version != versionesLocal[5].version ){
						WL.Logger.debug(" PROCESAR CUPONES DE LAS CATEGORIAS CARGADAS PARA SUSTITUCION ::");
						return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).findAll();
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if( versionesServer[5].version != versionesLocal[5].version ) {
						if(arrayResults != undefined && arrayResults.length > 0){
							WL.Logger.debug("INICIAR COLECCIONES DE CUPONES ...para las NUEVAS. "+arrayResults.length +" categorias");
							categoriasNuevas = [];
							numCategorias = arrayResults.length;
							for(i=0; i < arrayResults.length; i++){
								//WL.Logger.debug("Documento de Categorias  JSON.stringify :: "+JSON.stringify(arrayResults[i].json));
								categoriasNuevas[i] = arrayResults[i].json;
								var sigCategoria = arrayResults[i].json;

								collectionsDesc[sigCategoria.name]= {};
								collectionsDesc[sigCategoria.name].searchFields= searchFields;
							}
							WL.Logger.debug("antes de iniciar las colecciones  hay..... "+ categoriasNuevas.length+" categorias nuevas");
							/* Obtenemos las colecciones anteriores para inicializar todas nuevamente 
							*/
							WL.Logger.debug("AGREGAR LAS COLECCIONES QUE NO SON DE CUPONES PARA INICIARLAS NUEVAMENTE " );
							collectionsDesc[VERSIONES_COLL_LOCALES]= {};
							collectionsDesc[VERSIONES_COLL_LOCALES].searchFields= searchFields;

							collectionsDesc[VERSIONES_COLLECTION_NAME]= {};
							collectionsDesc[VERSIONES_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[VERSIONES_COLLECTION_NAME].adapter = getAdapter(VERSIONES_COLLECTION_NAME, 22000);
							
							collectionsDesc[HOME_COLLECTION_NAME]= {};
							collectionsDesc[HOME_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[HOME_COLLECTION_NAME].adapter = getAdapter(HOME_COLLECTION_NAME, 32000);

							collectionsDesc[CONTACTO_COLLECTION_NAME]= {};
							collectionsDesc[CONTACTO_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[CONTACTO_COLLECTION_NAME].adapter = getAdapter(CONTACTO_COLLECTION_NAME, 26000);

							collectionsDesc[SUCURSALES_COLLECTION_NAME]= {};
							collectionsDesc[SUCURSALES_COLLECTION_NAME].searchFields= searchFields;
							//collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

							collectionsDesc[DESCBANNER_COLLECTION_NAME]= {};
							collectionsDesc[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
							
							collectionsDesc[CATEGORIAS_COLLECTION_NAME]= {};
							collectionsDesc[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
							collectionsDesc[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);
							
							return WL.JSONStore.init(collectionsDesc, optionsIni);
						}
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {				
				try{
					if(versionesServer[5].version != versionesLocal[5].version) {
						WL.Logger.debug('obten la coleccion de VERSIONES_COLL_LOCALES para recuperar nuevos Ids. ');
						return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
					}else{
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La quinta consulta de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if(versionesServer[5].version != versionesLocal[5].version) {
						WL.Logger.debug('Asigna nuevos Ids a idsColLocalVersions. ');
						if(idsColLocalVersions.length > 0){
							idsColLocalVersions.splice(0, idsColLocalVersions.length);
						}
						for(i=0; i < arrayResults.length; i++){
							idsColLocalVersions[i] = arrayResults[i]._id;
						}
					}
					return;
				}catch (error) {
					WL.Logger.error("Error en el arranque. La quinta consulta de Ids de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {		
				try{
					if(versionesServer[5].version != versionesLocal[5].version) {
						if(categoriasNuevas != undefined && categoriasNuevas.length > 0){
							WL.Logger.debug("Hay..... "+ categoriasNuevas.length+" categorias nuevas. en SUSTITUCION");
							
							for(i=0; i < categoriasNuevas.length; i++){
								var sigCategoria = categoriasNuevas[i];

								WL.Logger.debug("categoriasNuevas sigCategoria :: "+sigCategoria.name);
								var invocationData = {
									adapter : 'DatosApp',
									procedure : 'getMainDataApp',
									parameters : ["v1.1/cupones/"+sigCategoria.name]
								};
								var options = {
									onSuccess : loadCuponesSuccess,
									onFailure : loadCuponesFailure,
									invocationContext: {}
								};
								WL.Client.invokeProcedure(invocationData, options);
							}
						}
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CUPONES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( versionesServer[2].version != versionesLocal[2].version ){
						WL.Logger.debug("LIMPIAR COLECCION CONTACTO_COLLECTION_NAME :: ");
						return WL.JSONStore.get(CONTACTO_COLLECTION_NAME).clear();
					}else {
						WL.Logger.debug("LA COLECCION CONTACTO_COLLECTION_NAME NO REQUIERE LIMPIARSE:: CONTINUA ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CONTACTO no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[2].version != versionesLocal[2].version) ){
						WL.Logger.debug("ACTUALIZAR LA COLECCION CONTACTO_COLLECTION_NAME :: ");
						return WL.JSONStore.get(CONTACTO_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LA COLECCION CONTACTO_COLLECTION_NAME NO REQUIERE ACTUALIZARSE:: ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CONTACTO no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[2].version != versionesLocal[2].version) ){
						WL.Logger.debug('# procesaColecciones :: CONTACTO_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[2];
							json_col = versionesServer[2];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de CONTACTO_COLLECTION_NAME :: " + JSON.stringify(doc));
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
							return;
						}
					}else {
						WL.Logger.debug("LA COLECCION CONTACTO_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para HOME_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			/*
			.then(function () {
				try{
					if(versionesServer[1].version != versionesLocal[1].version){
						WL.Logger.debug("LIMPIAR COLECCION SUCURSALES_COLLECTION_NAME::  ");
						return WL.JSONStore.get(SUCURSALES_COLLECTION_NAME).clear();
					}else {
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en la carga de contenidos de Sucursales. La sincronizacion de recursos de SUCURSALES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					stateCP = mapStatesSinc[2];					
					if( esPrimeraCarga || (versionesServer[1].version != versionesLocal[1].version) ){
						WL.Logger.debug("ACTUALIZAR COLECCION DE SUCURSALES :: ");
						
						return WL.JSONStore.get(SUCURSALES_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LA COLECCION DE SUCURSALES NO REQUIERE ACTUALIZARSE:: CONTINUA ");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de SUCURSALES no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				try{
					if( esPrimeraCarga || (versionesServer[1].version != versionesLocal[1].version) ){
						WL.Logger.debug('# procesaColecciones :: SUCURSALES_COLLECTION_NAME actualizado:: ' );
						if (idsColLocalVersions.length > 0){
							id_doc = idsColLocalVersions[1];
							json_col = versionesServer[1];
							
							var doc = {_id: id_doc, json: json_col };
							WL.Logger.debug("Doc for versiones colecction de SUCURSALES_COLLECTION_NAME :: " + JSON.stringify(doc));
							return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, optionsReplace);
						}else {
							WL.Logger.debug("No existen registros en idsColLocalVersions:: CONTINUA");
							return;
						}
					}else {
						WL.Logger.debug("LA COLECCION SUCURSALES_COLLECTION_NAME NO FUE ACTUALIZADA:: CONTINUA");
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para HOME_COLLECTION_NAME no pudo ser concluida. "+ error.message);
					return;
				}
			})
			*/
			.fail(function (errorObject) {
				/* Si hay falla en la carga de colecciones entonces borrar las colecciones*/
				stateCP = mapStatesSinc[3];

				WL.Logger.ctx({ pretty: true }).error(errorObject);
				WL.Logger.error("Error en la carga de contenidos error code:: "+errorObject.err);
				WL.Logger.error("Error On JSONStore errorObject.col :: " +errorObject.col);

				/* Si el codigo de error es menor a cero entonces borrar las colecciones
				*/
				if( ( errorObject.err != undefined ) && ( errorObject.err < 0)  )
				{
					WL.JSONStore.destroy()
					.then(function () {
						WL.Logger.debug("On Fail load then destroy sucess...");
					})
					.fail(function (errorObject) {
						WL.Logger.error("On Fail destroy then go bootstrapApplication ...");
						WL.Logger.ctx({ pretty: true }).error(errorObject);
					}); //fin destroy
				}else{
					/* Si ocurrio un error en la descarga entonces la App continuara con el arranque,
					   y se debe mantener las versiones actuales de cada coleccion
					   apartir de la colección donde ocurre la falla
					*/
					
				}
				
			})
		; // FIN INIT

	}


});
