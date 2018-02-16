var msgTitulo 	= 'Adventencia';
var msg 		= 'No se pudo completar su solicitud, puede comunicarse al Centro de Atención  5246-5455.';
var ambiente = "www3";
var DATA_USER_COLLECTION_NAME = 'dataUser';
var collections = {},
	optionsIni = {};

//document.addEventListener("deviceready", onDeviceReady, false);
/*
function onDeviceReady() {
    console.log('statusBar ::' + JSON.stringify(StatusBar));
}
*/

function wlCommonInit() {

    var env = WL.Client.getEnvironment();
    if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
        document.body.classList.add('platform-ios'); 
    } else if(env === WL.Environment.ANDROID){
        document.body.classList.add('platform-android'); 
    }
	
    WL.Client.connect({
        onSuccess:function() {
        console.log("Connected to MFP");
        }, 
        onFailure:function(f) {
        console.log("Failed to connect to MFP, not sure what to do now.", f); 
        }
        });
    
	(function (WL, jQuery, lodash) {

		var $ = jQuery,
			_ = lodash;
     
		invokeGetNetworkInfo();
	} (WL, WLJQ, WL_));
}


function invokeGetNetworkInfo() {
	WL.Device.getNetworkInfo(getNetworkInfoCallback);
}


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

function getNetworkInfoCallback(info) {
	//WL.Logger.debug("getNetworkInfoCallback:: "+JSON.stringify(info));

	var VERSIONES_COLLECTION_NAME = 'versiones',
		VERSIONES_COLL_LOCALES = 'versionesLocal',
		HOME_COLLECTION_NAME = 'home',
		CONTACTO_COLLECTION_NAME = 'contacto',
		SUCURSALES_COLLECTION_NAME = 'sucursales',
		DESCBANNER_COLLECTION_NAME = 'descbanner',
		CATEGORIAS_COLLECTION_NAME = 'categoriasdesc',
		CATEGORIAS_COLL_LOCAL = 'categoriasLocalVersion',
		CUPONES_COLLECTION_NAME = 'cupones';

	var unMapSeccionCollIdPosicion = {
			HOME_COLLECTION_NAME: 0,
			SUCURSALES_COLLECTION_NAME: 1,
			CONTACTO_COLLECTION_NAME: 2,
			DESCBANNER_COLLECTION_NAME: 3,
			CATEGORIAS_COLLECTION_NAME : 5
	};
	
	var versionesLocal = [],
		idsColLocalVersions = [],
		versionesServer = [],
		esPrimeraCarga = true,
		searchFields = {'name': 'string'},
		searchFieldsDataUser = {'email'		: 'string',
								'vartemp' 	: 'string',
								'pass'		: 'string',
								'terminos' 	: 'string'},
		redyforRunApp = true;
	var recargaCategorias = false;
	var intentoArranque = 0;

	// Object that defines all the collections
	var collectionsDesc = {};
	var categoriasLocales = [];
	var categoriasNuevas = [];
	var contCargaCuponesSucess = 0;
	var numCategorias= 0;
	var optionsReplace = {
						push: true
					};
	var addOptions = {};
	
	collections[DATA_USER_COLLECTION_NAME]= {};
	collections[DATA_USER_COLLECTION_NAME].searchFields = searchFieldsDataUser;

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
	collections[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

	collections[DESCBANNER_COLLECTION_NAME]= {};
	collections[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
	collections[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
	
	collections[CATEGORIAS_COLLECTION_NAME]= {};
	collections[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
	collections[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);

	//Optional username
	//Optional password
	//Optional local key generation flag
	optionsIni.password = 'Costco01';
	optionsIni.localKeyGen = false;
	optionsIni.clear = true;
	//Optional clear flag
   
	if (info.isNetworkConnected == true || info.isNetworkConnected == 'true') {
		WL.Logger.info("Tiene acceso a una red.");

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
		if(versionesServer.length > 0){
			versionesServer.splice(0, versionesServer.length);
		}

		WL.JSONStore.init(collections, optionsIni)
			.then(function () {
				WL.Logger.debug(['Colecciones inicializadas. Consulta 1 de versiones Local.'].join('\n'));
				try{
                    if (WL.JSONStore.get(VERSIONES_COLL_LOCALES) != undefined) {
						return WL.JSONStore.get(VERSIONES_COLL_LOCALES).findAll();
					}else{
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La primer consulta de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function (arrayResults) {
				try{
					if(arrayResults != undefined && arrayResults.length > 0){
						WL.Logger.debug("##### Num Versiones en Local :: "+arrayResults.length);
						if(idsColLocalVersions.length > 0){
							idsColLocalVersions.splice(0, idsColLocalVersions.length);
						}
						for(i=0; i < arrayResults.length; i++){
							versionesLocal[i] = arrayResults[i].json;
							idsColLocalVersions[i] = arrayResults[i]._id;
						}
						esPrimeraCarga = false;
						return WL.JSONStore.get(VERSIONES_COLLECTION_NAME).clear();
					}else{
						WL.Logger.debug(" Es primera carga porque no hay documentos en coleccion de versiones en local :: ");
						esPrimeraCarga = true;
						return WL.JSONStore.get(VERSIONES_COLLECTION_NAME).clear();
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La primer consulta de Ids de versiones locales no pudo ser concluida. "+ error.message);
					return;
				}
			})
			.then(function () {
				//Si es primer arranque y no hay comunicacion con el servidor 
				// entonces puede iniciar con Fail decarga de versiones
				try{
					WL.Logger.debug("Actualizar la coleccion VERSIONES_COLLECTION_NAME... ");
					return WL.JSONStore.get(VERSIONES_COLLECTION_NAME).load();
				}catch (error) {
					WL.Logger.error("Error en el arranque. La consulta de versiones del servdor no pudo ser concluida. "+ error.message);
					return;
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
							WL.Logger.debug("### JSON versionesServer[ "+i+" ] :: "+ JSON.stringify(versionesServer[i]));
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
			.then(function (responseFromEndpoint) {
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
			/*
			.then(function (responseFromEndpoint) {
				try{
					//LEER ANTES DE BORRAR
					WL.Logger.debug("LA COLECCION CATEGORIAS_COLLECTION_NAME :: CONSULTA DE CATEGORIAS ");
					return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).findAll();
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
					return;
				}
			})
			*/
			/*
			.then(function (result) {
				try{
					if(result != undefined && result.length == 0){
						recargaCategorias = true;
					}else{
						recargaCategorias= false;
						numCategorias = result.length;
					}

					if( recargaCategorias ) {
						WL.Logger.debug("CARGA LA COLECCION CATEGORIAS_COLLECTION_NAME :: ");
						
						return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).load();
					}else {
						WL.Logger.debug("LAS COLECCIONES DE CUPONES DEBEN INICIARSE PARA EL ARRANQUE ANTES DE SINCRONIZAR CONTENIDOS :: ");
						if(result != undefined && result.length > 0){
							WL.Logger.debug("INICIAR COLECCIONES DE CUPONES ...para las . "+result.length +" categorias existentes ");
							
							for(i=0; i < result.length; i++){
								//WL.Logger.debug("Documento de Categorias  JSON.stringify :: "+JSON.stringify(arrayResults[i].json));
								var sigCategoria = result[i].json;
								collectionsDesc[sigCategoria.name]= {};
								collectionsDesc[sigCategoria.name].searchFields= searchFields;
							}
							WL.Logger.debug("INICIAR OTRAS COLECCIONES DEL CONTENIDO... ");

							//Obtenemos las colecciones anteriores para inicializar todas nuevamente 
							
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
							collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

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
			*/
			/*
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
			*/
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
			/*
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
			*/
			/*
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
								// Obtenemos las colecciones anteriores para inicializar todas nuevamente 
								
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
								collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

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
			*/
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
			/*
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
			*/
			/*
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
			*/
			/*
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
			*/
			/*
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
			*/
			/*
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
							// Obtenemos las colecciones anteriores para inicializar todas nuevamente 
							
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
							collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

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
			*/
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
				testRunApp(redyforRunApp);
						redyforRunApp = false;
						return;
				/*try{
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
						testRunApp(redyforRunApp);
						redyforRunApp = false;
						return;
					}
				}catch (error) {
					WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CUPONES no pudo ser concluida. "+ error.message);
					return;
				}
				*/
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
			.fail(function (errorObject) {
				/* Si hay falla en la carga de colecciones entonces arranca la App */
				testRunApp(redyforRunApp);
				redyforRunApp = false;

				/*
				WL.Logger.ctx({ pretty: true }).error(errorObject);
				WL.Logger.error("Error en la carga de contenidos error code:: "+errorObject.err);
				WL.Logger.error("Error On JSONStore errorObject.col :: " +errorObject.col);
				
				// Si el codigo de error es menor a cero entonces borrar las colecciones
				
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
					// Si ocurrio un error en la descarga entonces la App continuara con el arranque,
					//   y se debe mantener las versiones actuales de cada coleccion
					//   apartir de la colección donde ocurre la falla
					
					var id_doc = 0;
					var id_col= 0;
					var json_col = {};
					var collectionName = errorObject.col;
					var options = {
						push: true
					};
					
					// Si hay colecciones prexistentes 
					if (versionesLocal.length > 0 && idsColLocalVersions.length > 0){
						id_col = unMapSeccionCollIdPosicion[collectionName];
						id_doc = idsColLocalVersions[id_col];
						json_col = versionesLocal[id_col];
						json_col.version = 0;
						json_col.fvencimiento = "2016/02/01";
						json_col.fpublicacion = "2016/01/01";
						
						var doc = {_id: id_doc, json: json_col };
						WL.Logger.debug("On doc for versiones colecction :: " + JSON.stringify(doc));
						WL.Logger.debug("On JSON version en json doc :: " + JSON.stringify(json_col.version));
						
						WL.JSONStore.get(VERSIONES_COLL_LOCALES)
						.replace(doc, options)
						.then(function (numberOfDocumentsReplaced) {
							//Ahora comprobamos en cuantas colecciones se debe mantener la version preexistente 
							if ( id_col == 5 ) {
								json_col = versionesLocal[id_col-1];
								json_col.version = 0;
								json_col.fvencimiento = "2016/02/01";
								json_col.fpublicacion = "2016/01/01";
								doc = {_id: id_doc-1, json: json_col };
								WL.Logger.debug(" doc for versiones colecction :: " + JSON.stringify(doc));
								WL.Logger.debug(" JSON version en json doc :: " + JSON.stringify(json_col.version));
								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, options);
							}else{
								return;
							}
						})
						.then(function (numberOfDocumentsReplaced) {
							if ( id_col < 4 ) {
								json_col = versionesLocal[id_col+1];
								json_col.version = 0;
								json_col.fvencimiento = "2016/02/01";
								json_col.fpublicacion = "2016/01/01";
								doc = {_id: id_doc+1, json: json_col };
								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, options);
							}else{
								return;
							}
						})
						.then(function (numberOfDocumentsReplaced) {
							if ( id_col < 3 ) {
								json_col = versionesLocal[id_col+1];
								json_col.version = 0;
								json_col.fvencimiento = "2016/02/01";
								json_col.fpublicacion = "2016/01/01";
								doc = {_id: id_doc+1, json: json_col };
								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, options);
							}else{
								return;
							}
						})
						.then(function (numberOfDocumentsReplaced) {
							if ( id_col < 2 ) {
								json_col = versionesLocal[id_col+1];
								json_col.version = 0;
								json_col.fvencimiento = "2016/02/01";
								json_col.fpublicacion = "2016/01/01";
								doc = {_id: id_doc+1, json: json_col };
								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, options);
							}else{
								return;
							}
						})
						.then(function (numberOfDocumentsReplaced) {
							if ( id_col < 1 ) {
								json_col = versionesLocal[id_col+1];
								json_col.version = 0;
								json_col.fvencimiento = "2016/02/01";
								json_col.fpublicacion = "2016/01/01";
								doc = {_id: id_doc+1, json: json_col };
								return WL.JSONStore.get(VERSIONES_COLL_LOCALES).replace(doc, options);
							}else{
								return;
							}
						})
						.then(function (numberOfDocumentsReplaced) {
							return;
						})
						.fail(function (errorObject) {
							WL.Logger.debug("Fallo el remplazo de versiones ... ");
							WL.Logger.ctx({ pretty: true }).error(errorObject);
						});
						
					}
				}
				*/
			})
		; // FIN INIT

		function loadCuponesSuccess(result){
			if (result.invocationResult.array.length > 0){
				WL.Logger.debug("loadCuponesSuccess result.invocationResult.array total de cupones::::: " + result.invocationResult.array.length);
				
				var sigCategoria = result.invocationResult.array[0].categoria

				WL.JSONStore.get(sigCategoria).add(result.invocationResult.array, addOptions)
				.then(function () {
					//WL.Logger.debug("loadCuponesSuccess true, Se ha agregado contenido a la colecccion::  " + sigCategoria+ " intento arranque"+intentoArranque);
					intentoArranque++;
					contCargaCuponesSucess++;
					WL.Logger.debug("### contCargaCuponesSucess :: "+ contCargaCuponesSucess );
					WL.Logger.debug("### loadCuponesSucess numCategorias :: "+ numCategorias );

					if(contCargaCuponesSucess == numCategorias){
						WL.Logger.debug('# loadCuponesSuccess :: CUPONES_COLLECTION_NAME actualizado:: ' );
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
				})
				.then(function () {
					try{
						if (intentoArranque == 2 || sigCategoria == 'AB' ){
							testRunApp(redyforRunApp);
							redyforRunApp = false;
						}
						return;	
					}catch (error) {
						WL.Logger.error("Error en procesaColecciones. La sustitucion de version local para CUPONES_COLLECTION_NAME no pudo ser concluida. "+ error.message);
						return;
					}
				})
				.fail(function (errorObject) {
					WL.Logger.error("loadCuponesSuccess falla NO se agregaron contenidos a la coleccion "+sigCategoria);
					WL.Logger.ctx({ pretty: true }).error(errorObject);
				});
			}
		};

		function loadCuponesFailure(result){
			WL.Logger.debug("Cupones retrieve Fail ....................");
		};

	}// Fin if isNetworkConnected
	else {
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
		collections[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 26000);

		collections[DESCBANNER_COLLECTION_NAME]= {};
		collections[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
		collections[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 26000);
		
		collections[CATEGORIAS_COLLECTION_NAME]= {};
		collections[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
		collections[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 20000);
		
		WL.Logger.debug(' modo offline');

		WL.JSONStore.init(collections, optionsIni)
		.then(function () {
			try{
				WL.Logger.debug('Iniciando las colecciones modo offline');
				testRunApp(redyforRunApp);
				redyforRunApp = false;
				
				if (WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME) != undefined) {
					WL.Logger.debug('CATEGORIAS_COLLECTION_NAME definida en el modo offline');
					return WL.JSONStore.get(CATEGORIAS_COLLECTION_NAME).findAll();
				}else{
					return;
				}
			}catch (error) {
				WL.Logger.error("Error en el arranque modo offline. La sincronizacion de Contenidos no pudo ser concluida. "+ error.message);
				return;
			}
		})
		.then(function (result) {
			try{
				
				if(result != undefined && result.length > 0){
					WL.Logger.debug("INICIAR COLECCIONES DE CUPONES ...para las . "+result.length +" categorias existentes ");
					numCategorias = result.length;

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
					collectionsDesc[VERSIONES_COLLECTION_NAME].adapter = getAdapter(VERSIONES_COLLECTION_NAME, 15000);
					
					collectionsDesc[HOME_COLLECTION_NAME]= {};
					collectionsDesc[HOME_COLLECTION_NAME].searchFields= searchFields;
					collectionsDesc[HOME_COLLECTION_NAME].adapter = getAdapter(HOME_COLLECTION_NAME, 18000);

					collectionsDesc[CONTACTO_COLLECTION_NAME]= {};
					collectionsDesc[CONTACTO_COLLECTION_NAME].searchFields= searchFields;
					collectionsDesc[CONTACTO_COLLECTION_NAME].adapter = getAdapter(CONTACTO_COLLECTION_NAME, 15000);

					collectionsDesc[SUCURSALES_COLLECTION_NAME]= {};
					collectionsDesc[SUCURSALES_COLLECTION_NAME].searchFields= searchFields;
					collectionsDesc[SUCURSALES_COLLECTION_NAME].adapter = getAdapter(SUCURSALES_COLLECTION_NAME, 15000);

					collectionsDesc[DESCBANNER_COLLECTION_NAME]= {};
					collectionsDesc[DESCBANNER_COLLECTION_NAME].searchFields= searchFields;
					collectionsDesc[DESCBANNER_COLLECTION_NAME].adapter = getAdapter(DESCBANNER_COLLECTION_NAME, 15000);
					
					collectionsDesc[CATEGORIAS_COLLECTION_NAME]= {};
					collectionsDesc[CATEGORIAS_COLLECTION_NAME].searchFields= searchFields;
					collectionsDesc[CATEGORIAS_COLLECTION_NAME].adapter = getAdapter(CATEGORIAS_COLLECTION_NAME, 15000);
					
					return WL.JSONStore.init(collectionsDesc, optionsIni);
				}
			}catch (error) {
				WL.Logger.error("Error en el arranque. La sincronizacion de recursos de CATEGORIAS no pudo ser concluida. "+ error.message);
				return;
			}
		})
		.fail(function (errorObject) {
			//WL.Logger.debug("Error en JSONStore status... "+errorObject.status);
			WL.Logger.ctx({ pretty: true }).error(errorObject);
			testRunApp(redyforRunApp);
			redyforRunApp = false;
		})
	}

}

function testRunApp(redyforRunApp){
	if(redyforRunApp){
		//WL.Logger.debug("&&& In test bootstrapApplication... ");
		bootstrapApplication();
	}
}

function bootstrapApplication() {
	angular.element(document).ready(function() {
		WL.App.hideSplashScreen();
		angular.bootstrap(document, ['starter']);
	});
}

function getAdapterGeneraIdTransaccion() {
	var invocationData = {
        adapter : 'CashCard',
        procedure : 'generaIdTransaccion'
    };
	return invocationData;
}


function getAdapterConsultaVinculacionCC (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber) {
    var invocationData = {
            adapter : 'CashCard',
            procedure : 'consultaVinculacionCC',
			parameters : [prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber]
        };
	return invocationData;
}

function getAdapterVinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {

	var invocationData = {
        adapter : 'CashCard',
        procedure : 'vinculaCCMembresia',
		parameters : [prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber]
    };
	return invocationData;
}

function getAdapterGeneraToken (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {

	var invocationData = {
            adapter : 'CashCard',
            procedure : 'generaToken',
            parameters : [prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber]
        };
	
	return invocationData;
}

function getAdapterDesvinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {

	var invocationData = {
            adapter : 'CashCard',
            procedure : 'desvinculaCCMembresia',
            parameters : [prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber]
        };
	
	return invocationData;
}

function consultaTarjetaDigitalMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {

	var invocationData = {
            adapter : 'CashCard',
            procedure : 'consultaTarjetaDigitalMembresia',
            parameters : [prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber]
        };
	
	return invocationData;
}

function getAdapterLogin(nombre, contra, hash1, uuid) {

	var invocationData = {
            adapter : 'Login',
            procedure : 'LoginModule',
            parameters : [nombre, contra, hash1, uuid]
        };
	
	return invocationData;
}

function getReloadCard(prmOrderId, prmTrxId, prmCardNumber, prmMembershipIPK, prmIdTarjetaDigital, prmAmount, prmCvc, prmMarca) {

	var invocationData = {
            adapter : 'RecargaTarjetaDigital',
            procedure : 'recargaTarjetaDigital',
            parameters : [prmOrderId, prmTrxId, prmCardNumber, prmMembershipIPK, prmIdTarjetaDigital, prmAmount, prmCvc, prmMarca]
        };
	
	return invocationData;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day,month, year].join('/');
}

function getAdapterEnviaDatosFactura(noTicket) {

	var invocationData = {
            adapter : 'Facturacion',
            procedure : 'datosFacturacion',
            parameters : [noTicket]
        };
	
	return invocationData;
}

function getAdapterEnviaDatosRFC(rfc) {

	var invocationData = {
            adapter : 'Facturacion',
            procedure : 'datosRFC',
            parameters : [rfc]
        };
	
	return invocationData;
}

function getAdapterEnviaDatosGeneraFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, noTicket, correo) {

	var invocationData = {
            adapter : 'Facturacion',
            procedure : 'datosGeneraFactura',
            parameters : [rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, noTicket, correo]
        };
	
	return invocationData;
}

function getAdapterEnviaDatosReenvioFactura(noTicket, membresia, correo) {

	var invocationData = {
            adapter : 'Facturacion',
            procedure : 'datosReenvioFactura',
            parameters : [noTicket, membresia, correo]
        };
	
	return invocationData;
}

function getAdapterEnviaDatosReenvioFactura(noTicket, membresia, correo) {

	var invocationData = {
            adapter : 'Facturacion',
            procedure : 'datosReenvioFactura',
            parameters : [noTicket, membresia, correo]
        };
	
	return invocationData;
}

function getEstadoFacturacion() {

	var invocationData = {
            adapter : 'DatosApp',
            procedure : 'getContentApp',
            parameters : ['facturacion']
        };
	
	return invocationData;
}

function getpreguntasFrecuentes() {

	var invocationData = {
            adapter : 'DatosApp',
            procedure : 'getMainDataApp',
            parameters : ['preguntasfrecuentes']
        };
	
	return invocationData;
}
