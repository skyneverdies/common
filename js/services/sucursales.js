
/* JavaScript content from js/services/sucursales.js in folder common */
app.factory('sucursalesService',function($state){
  /*  
  var jsonSucursales={"returnCode":0,"sucursales":[{"id":"708","nombre":"AGUASCALIENTES","direccion":["BLVD. AGS. C. NTE #802","LAS TROJES","20864","AGUASCALIENTES, AGS."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 449 500 3200"],"telAtencionNegocios":["01 449 912 7351"],"correo":["bus708@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"15-oct-94","latitud":21.9162433999407,"longitud":-102.287886465118,"distanceToRigen":0.0},{"id":"726","nombre":"ARBOLEDAS","direccion":["AV. SAN NICOLAS #10","PARQUE INDUSTRIAL SAN NICOLÁS","54030","TLANEPANTLA, EDO. MEX."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 5321 3280"],"telAtencionNegocios":["01 55 5321 3285"],"correo":["bus726@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"04-dic-04","latitud":19.5512529836419,"longitud":-99.2029033755493,"distanceToRigen":0.0},{"id": "5311", "nombre": "ATIZAP\u00c1N", "direccion": ["AV. RUIZ CORTINES #1", "MANZANA III, LOTE III", "LOMAS DE ATIZAP\u00c1N 2DA SEC.", "52977", "ATIZAP\u00c1N DE ZARAGOZA", "EDO. MEX."], "horarioLunesSabado": "9:00 a 21:00 hrs.", "horarioDomingo": "9:00 a 20:00 hrs.", "telConmutador": ["01 55 4780 0600"], "telAtencionNegocios": ["01 55 2345 0140"], "correo": ["bus5311@costco.com.mx"], "servicios": ["REVELADO_DIGITAL", "SERVICIO_DELI", "CENTRO_LLANTERO", "AYUDA_AUDITIVA", "FRUTAS_VERDURAS", "CARNICERIA", "PANADERIA", "FUENTE_SODAS", "FARMACIA", "OPTICA", "FLORERIA"], "apertura": "16-feb-17", "latitud": 19.54831, "longitud": -99.27111, "distanceToRigen": 0},{"id":"712","nombre":"CANCÚN","direccion":["SUPERMNZ #21 MNZ 4 LTE 2","BENITO JAREZ","77500","CANCÚN, QUINTANA ROO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 998 881 0250"],"telAtencionNegocios":["01 998 881 0265 al 69"],"correo":["bus712@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"23-sep-99","latitud":21.148481,"longitud":-86.83546,"distanceToRigen":0.0},{"id":"755","nombre":"CD. JUÁREZ","direccion":["RANCHO AGUA CALIENTE #6911","PRADERA DORADA","32610","CD. JUÁREZ, CHIHUAHUA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 656 147 1100"],"telAtencionNegocios":["01 656 227 6804"],"correo":["bus755@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"02-jun-06","latitud":31.7023203262983,"longitud":-106.423166120575,"distanceToRigen":0.0},{"id":"795","nombre":"CENTRO DE DISTRIBUCI\u00d3N","direccion":["AV. CENTRAL # 3","PARQUE INDUSTRIAL TEPEJI","42890","TEPEJI DEL RIO OCAMPO, HGO."],"horarioLunesSabado":"","horarioDomingo":"","horarioLunesViernes":"6:00 a 16:00 hrs.","telConmutador":["01 773 732 9400"],"telAtencionNegocios":["01 773 732 9400"],"correo":["bus795@costco.com.mx","bus796@costco.com.mx"],"apertura":"16-feb-09","latitud":19.856105,"longitud":-99.283597,"distanceToRigen":0.0},{"id":"723","nombre":"CELAYA","direccion":["AV. TECNOLÓGICO N° 651","CIUDAD INDUSTRIAL (CENTRO)","38000","CELAYA, GUANAJUATO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 461 192 1300"],"telAtencionNegocios":["01 461 192 1308"],"correo":["bus723@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"14-dic-02","latitud":20.5455460802112,"longitud":-100.820331895874,"distanceToRigen":0.0},{"id":"756","nombre":"CHIHUAHUA","direccion":["AV DE LA JUVENTUD (LUIS DONALDO COLOSIO M) #7513\t\t","FRACC PREDIO LA CNATERA","31115","CHIHUAHUA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 614 380 2300"],"telAtencionNegocios":["01 614 432  6914","01 614 432  6915"],"correo":["bus756@costco.com.mx"],"servicios":["AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"09-abr-13","latitud":28.648768,"longitud":-106.13049,"distanceToRigen":0.0},{"id":"702","nombre":"COAPA","direccion":["C. PUENTE #186","AMSA","14380","TLALPAN"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 5483 9080"],"telAtencionNegocios":["01 55 5671 7438","01 55 5483 9095"],"correo":["bus702@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"01-may-93","latitud":19.284359072903,"longitud":-99.1386546274414,"distanceToRigen":0.0},{"id":"713","nombre":"CUERNAVACA","direccion":["AV. VICENTE GUERRERO #205","LOMAS DE LA SELVA","62270","CUERNAVACA, MOR."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 777 101 0510"],"telAtencionNegocios":["01 777 364 5662"],"correo":["bus713@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"09-sep-03","latitud":18.9344808891732,"longitud":-99.233429754303,"distanceToRigen":0.0},{"id":"729","nombre":"CULIACÁN","direccion":["BLVD. PEDRO INFANTE #2152","DESARROLLO URBANO TRES RÍOS","80020","CULIACÁN, SINALOA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["66 78003100"],"telAtencionNegocios":["66 77585556"],"correo":["bus729@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"30-abr-15","latitud":24.798096,"longitud":-107.425213,"distanceToRigen":0.0},{"id":"754","nombre":"ENSENADA","direccion":["CTA TRANSPENINSULAR ENSENADA - LA PAZ #4179","CARLOS PACHECO","22832","ENSENADA, B. CALIF. NORTE"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 646 172 3810"],"telAtencionNegocios":["01 646 172 3811","01 646 172 3810"],"correo":["bus754@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"18-ago-05","latitud":31.8180273796978,"longitud":-116.596988761948,"distanceToRigen":0.0},{"id":"703","nombre":"GUADALAJARA VALLARTA","direccion":["AV. VALLARTA #4775","FRACC. CAMICHINES VALLARTA","45020","GUADALAJARA, JALISCO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 333 777 4040"],"telAtencionNegocios":["01 333 165 1378"],"correo":["bus703@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"15-ago-93","latitud":20.6791149054204,"longitud":-103.428297365234,"distanceToRigen":0.0},{"id":"730","nombre":"GUADALAJARA LÓPEZ MATEOS","direccion":["BLVD. ADOLFO LÓPEZ MATEOS","FRACC. NUEVA GALICIA","45645","TLAJOMULCO DE ZUÑIGA, JALISCO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 333 283 3330"],"telAtencionNegocios":["01 333 612 7566"],"correo":["bus730@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"14-AGO-2009","latitud":20.578313963291023,"longitud":-103.44929369740277,"distanceToRigen":0.0},{"id":"751","nombre":"HERMOSILLO","direccion":["AV. LUIS DONALDO C. # 416","VILLA SATÉLITE","83200","HERMOSILLO, SONORA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 662 236 0620"],"telAtencionNegocios":["01 662 236 0620","01 662 500 2700"],"correo":["bus751@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"25-ago-94","latitud":29.0826513508615,"longitud":-110.979241455124,"distanceToRigen":0.0},{"id":"718","nombre":"INTERLOMAS","direccion":["AV. MAGNOCENTRO #4","SAN FERNANDO LA HERRADURA","52765","HUIXQUILUCAN, EDO DE MEX"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 5950 0400"],"telAtencionNegocios":["01 55 5290 6399"],"correo":["bus718@costco.com.mx"],"servicios":["REVELADO_DIGITAL","CHOCOLATERIA","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"07-dic-98","latitud":19.4034084670416,"longitud":-99.2735341434936,"distanceToRigen":0.0},{"id":"705","nombre":"LE\u00d3N TORRES LANDA","direccion":["BLVD.JUAN TORRES LANDA 4137","JARDINES DEL JEREZ","37229","LEÓN, GUANAJUATO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 477 152 5800"],"telAtencionNegocios":["01 477 788 1307"],"correo":["bus705@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"15-may-94","latitud":21.098183908263,"longitud":-101.634006822632,"distanceToRigen":0.0},{"id":"725","nombre":"LEON CAMPESTRE","direccion":["BLVD. EUGENIO GARZA SADA NO. 102"," FRACCIONAMIENTO LOMAS DEL CAMPESTRE","37150","LEON, GUANAJUATO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 477 152 6200"],"telAtencionNegocios":["01 477 152 6225"],"correo":["bus725@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"30-Oct-14","latitud":21.156532,"longitud":-101.706166,"distanceToRigen":0.0},{"id": "5312","nombre": "LINDAVISTA","direccion": ["Av. Insurgentes Nte 1320 esq. Av. Fortuna","Magdalena de las Salinas","07760","Gustavo A. Madero, Ciudad de México"],"horarioLunesSabado": "9:00 a 21:00 hrs.","horarioDomingo": "9:00 a 20:00 hrs.","telConmutador": ["01 55 5747 5680"],"telAtencionNegocios": ["01 55 3067 5300"],"correo": [""],"servicios": ["SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura": "21-Feb-18","latitud": 19.481768,"longitud": -99.129665,"distanceToRigen": 0},{"id":"724","nombre":"LOS CABOS","direccion":["CARR. SAN JOSÉ DEL CABO #1659","EL TEZAL LOS CABOS","23410","LOS CABOS, B.C."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 624 146 7180"],"telAtencionNegocios":["01 624 104 3920","01 624 104 3921"],"correo":["bus724@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"18-oct-03","latitud":22.9042753215613,"longitud":-109.882454002426,"distanceToRigen":0.0},{"id":"733","nombre":"MÉRIDA","direccion":["CALLE 3-B  #243","COL. REVOLUCIÓN, 97110","MÉRIDA, YUCATAN","-"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 999 942 4650"],"telAtencionNegocios":["01 999 944 9806","01 999 944 9808"],"correo":["bus733@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"19-mar-15","latitud":21.0094521217924,"longitud":-89.622034156845,"distanceToRigen":0.0},{"id":"750","nombre":"MEXICALI","direccion":["C.SAN LUIS RIO COL, KM 7.5","EX EJIDO DE COAHUILA","21397","MEXICALI, BAJA CAL."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 686 500 3400"],"telAtencionNegocios":["01 686 580 4535","01 686 580 4536"],"correo":["bus750@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"20-nov-93","latitud":32.6066367083654,"longitud":-115.434358442352,"distanceToRigen":0.0},{"id":"707","nombre":"MIXCOAC","direccion":["BLVD. A.LÓPEZ MATEOS # 1181","SAN PEDRO DE LOS PINOS","1180","ALVARO OBREGÓN"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 5276 8160"],"telAtencionNegocios":["01 55 5516 3027"],"correo":["bus707@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"16-ago-94","latitud":19.3872367516025,"longitud":-99.1907182579498,"distanceToRigen":0.0},{"id":"722","nombre":"MONTERREY CARRETERA NACIONAL","direccion":["CARRETERA NACIONAL KILOMETRO 268+ 500 # 5001","BOSQUES DE VALLE ALTO","64989","MONTERREY. N. L."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 81 4739 1500"],"telAtencionNegocios":["01 81 8121 0077","01 81 8121 0078"],"correo":["bus722@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"26-sep-13","latitud":25.578331,"longitud":-100.25054,"distanceToRigen":0.0},{"id":"717","nombre":"MONTERREY CUMBRES","direccion":["ALEJANDRO DE RODAS #6767","CUMBRES","64340","MONTERREY, N. L."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 81 8121 0070"],"telAtencionNegocios":["01 81 8121 0077","01 81 8121 0078"],"correo":["bus717@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"28-jul-05","latitud":25.7295983959397,"longitud":-100.392798507737,"distanceToRigen":0.0},{"id":"715","nombre":"MONTERREY VALLE","direccion":["LAZARO CARDENAS #800","DEL VALLE","66269","MONTERREY, NL"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 81 4739 1900"],"telAtencionNegocios":["01 81 8133 9800"],"correo":["bus715@costco.com.mx"],"servicios":["REVELADO_DIGITAL","CHOCOLATERIA","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"03-sep-97","latitud":25.6398144043139,"longitud":-100.317739570663,"distanceToRigen":0.0},{"id":"710","nombre":"MORELIA","direccion":["PERIFÉRICO PASEO DE LA REPÚBLICA #2555","JOSEFA ORTIZ DE DOMINGUEZ","58088","MORELIA, MICHOÁCAN"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 443 322 3000"],"telAtencionNegocios":["01 443 322 3025"],"correo":["bus710@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"17-feb-95","latitud":19.6710090142001,"longitud":-101.211011732147,"distanceToRigen":0.0},{"id":"720","nombre":"POLANCO","direccion":["BLVD. MIGUEL DE C.SAAVEDRA #397","IRRIGACIÓN","11500","MIGUEL HIDALGO"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 2122 0260"],"telAtencionNegocios":["01 55 8647 9900"],"correo":["bus720@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"21-nov-98","latitud":19.4415893684507,"longitud":-99.2056853571472,"distanceToRigen":0.0},{"id":"714","nombre":"PUEBLA","direccion":["BLVD. DEL NIÑO POBLANO #2904","U.TERRITORIAL ATLIXCAYOTL","72197","PUEBLA, PUEBLA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 222 273 5300"],"telAtencionNegocios":["01 800 202 0231"],"correo":["bus714@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"15-sep-00","latitud":19.0334988987662,"longitud":-98.2377937679749,"distanceToRigen":0.0},{"id":"721","nombre":"PUERTO VALLARTA","direccion":["AV. FLUVIAL VALLARTA #134","FRACC. FLUVIAL VALLARTA","48310","PUERTO VALLARTA, JAL."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 322 226 2580"],"telAtencionNegocios":["01 322 226 2580"],"correo":["bus721@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"05-mar-08","latitud":20.6412382908755,"longitud":-105.223714435624,"distanceToRigen":0.0},{"id":"704","nombre":"QUERÉTARO","direccion":["BLVD.B.QUINTANA A.# 4107","PLAZA DEL PARQUE","76169","QRO, QRO."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 442 211 6700"],"telAtencionNegocios":["01 442 211 6708","01 442 211 6709"],"correo":["bus704@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"04-dic-93","latitud":20.6142531033239,"longitud":-100.393764102982,"distanceToRigen":0.0},{"id":"734","nombre":"SALTILLO","direccion":["BLVD. VENUSTIANO CARRANZA #6125","RANCHO DE PEÑA","25210","SALTILLO, COAHUILA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 844 438 0950"],"telAtencionNegocios":["01 844 438 0950"],"correo":["bus734@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"25-jun-15","latitud":25.477184,"longitud":-100.975196,"distanceToRigen":0.0},{"id":"716","nombre":"SAN LUIS POTOSÍ","direccion":["AV.CHAPULTEPEC #200","FRACC. COLINAS DEL PARQUE","78260","SAN LUIS POTOSÍ, S.L.P."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 444 834 1600"],"telAtencionNegocios":["01 444 833 5417"],"correo":["bus716@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"25-may-01","latitud":22.1384198774101,"longitud":-101.005930030869,"distanceToRigen":0.0},{"id":"701","nombre":"SATÉLITE","direccion":["CTO. CTRO.COMERCIAL #2001","CD. SATÉLITE","53100","NAUCALPAN,EDO. DE MEX."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 55 5374 9940"],"telAtencionNegocios":["01 55 5393 7203","01 55 5374 9952"],"correo":["bus701@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"29-feb-92","latitud":19.5078503609174,"longitud":-99.2353375343628,"distanceToRigen":0.0},{"id":"752","nombre":"TIJUANA LA MESA","direccion":["LAS ROCAS #8351","LOS ARENALES","22548","TIJUANA, BAJA CALIFORNIA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 664-622 6500"],"telAtencionNegocios":["01 664-622 6504","01 664-622 6506"],"correo":["bus752@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"09-dic-94","latitud":32.5085403279498,"longitud":-116.964269006775,"distanceToRigen":0.0},{"id":"753","nombre":"TIJUANA RIO","direccion":["BLVD. RODOLFO SÁNCHEZ TABOADA #8943","ZONA URBANA RIO","22010","TIJUANA, BAJA CALIFORNIA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 664 633 3555"],"telAtencionNegocios":["01 664 200 2483"],"correo":["bus753@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"24-jul-04","latitud":32.5319166717122,"longitud":-117.028910244034,"distanceToRigen":0.0},{"id":"709","nombre":"TOLUCA","direccion":["AV. S.S. JUAN PABLO II #501","BARRIO SAN MATEO","52140","TOLUCA, EDO MEX"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 722 275 7020"],"telAtencionNegocios":["01 722 275 7026"],"correo":["bus709@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"16-nov-06","latitud":19.257661,"longitud":-99.616825,"distanceToRigen":0.0},{"id":"732","nombre":"VERACRUZ","direccion":["BLVD. ADOLFO RUIZ CORTINEZ #1228","FRACC. SUTSEM","94294","BOCA DEL RÍO, VERACRUZ."],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 229 272 3900"],"telAtencionNegocios":["01 229 272 3900"],"correo":["bus732@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","AYUDA_AUDITIVA","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"10-nov-05","latitud":19.1629245496517,"longitud":-96.1065748577576,"distanceToRigen":0.0},{"id":"719","nombre":"XALAPA","direccion":["KM 1.8 CARR.XALAPA-VER #366","FRACC. LAS ANIMAS","91190","VERACRUZ, XALAPA"],"horarioLunesSabado":"9:00 a 21:00 hrs.","horarioDomingo":"9:00 a 20:00 hrs.","telConmutador":["01 228 841 6300"],"telAtencionNegocios":["01 228 841 6311 y 12"],"correo":["bus719@costco.com.mx"],"servicios":["REVELADO_DIGITAL","SERVICIO_DELI","CENTRO_LLANTERO","FRUTAS_VERDURAS","CARNICERIA","PANADERIA","FUENTE_SODAS","FARMACIA","OPTICA","FLORERIA"],"apertura":"13-may-00","latitud":19.5161153978305,"longitud":-96.883079731987,"distanceToRigen":0.0}]};
  */
  var jsonSucursales={"returnCode":0,"sucursales":[]};
  return{
    getTotal:function(){
      return jsonSucursales.sucursales.length;
    },
    getAll:function(){
      return jsonSucursales.sucursales;
    },
    getByNumber:function(max,sucursalesPar){
      var temp = [];
      var sucursales=sucursalesPar || jsonSucursales.sucursales;

       for (var i = 0; i < sucursales.length; i++) {
           if (i<max) {
               temp.push(sucursales[i]);
           }
       }
       return temp;
    },
    getById: function (id) {
      //console.log("Buscar id: "+id);
      var temp = [];
      var sucursales=jsonSucursales.sucursales;
       for (var i = 0; i < sucursales.length; i++) {
           if (sucursales[i].id == id) {
               temp.push(sucursales[i]);
           }
       }
       return temp[0] || [];
     },
     setSucursales: function(suc){
     	jsonSucursales.sucursales.push(suc);
     },
     resetSucursales: function(){
     	jsonSucursales.sucursales.length = 0;
     },
     saveSucursales: function(){
     	/*
     	if (WL.JSONStore && WL.JSONStore.get('sucursales') != undefined) {
            console.log('!= undefined saveSucursales;;');
            try{
                WL.JSONStore.get('sucursales').findAll().then(function (res) {
                    console.log('show data sucursales;; ' + JSON.stringify(res));
                    if (res.length == 0) {
                    	saveJsonStoreSucursales();
                    } else {
                    	resetJsonStoreSucursales();
                    }
                }).fail(function (errorObject) {
                    console.log('show data erroe' + errorObject.msg);
                    WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                    $state.go('app.home');
                });
            } catch(e) {
                console.log('error saveSucursales;;' + e);
                WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                $state.go('app.home');
            } 
        } else {
            console.log('== undefined saveSucursales;;');
        	*/
            WL.JSONStore.init(collections, optionsIni)
            .then(function () {
                //handle success
                try{
                    WL.JSONStore.get('sucursales').findAll(optionsIni).then(function (res) {
                        console.log('show data saveSucursales;; ' + JSON.stringify(res));
                        if (res.length == 0) {
	                    	saveJsonStoreSucursales();
	                    } else {
	                    	resetJsonStoreSucursales();
	                    }
                    }).fail(function (errorObject) {
                        console.log('show data erroe saveSucursales;;' + errorObject.msg);
                        WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                        $state.go('app.home');
                    });
                } catch(e) {
                    console.log('error saveSucursales;;' + e);
                    WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                    $state.go('app.home');
                }
            })
            .fail(function (errorObject) {
                //handle failure
                console.log('no function saveSucursales;;');
                WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                $state.go('app.home');
            });
        /*   
        }
        */
     }
  };  

	function saveJsonStoreSucursales(){
	  	WL.JSONStore.init(collections, optionsIni)
	  	.then(function () {
	      //handle success
	      WL.JSONStore.get('sucursales').add(jsonSucursales.sucursales).then(function (msg) {
	          console.log('add sucursales saveJsonStoreSucursales;;');
	      }).fail(function (errorObject) {
	          console.log('error add data sucursales saveJsonStoreSucursales2;;' + JSON.stringify(errorObject));                              
	      });
	  	})
	  	.fail(function (errorObject) {
	      //handle failure
	      console.log('no function saveJsonStoreSucursales;;');
	      WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
          $state.go('app.home');
	  	});
	}

	function resetJsonStoreSucursales(){
		/*
		if (WL.JSONStore && WL.JSONStore.get('sucursales') != undefined) {
		    console.log('!= undefined resetJsonStoreSucursales;;');
		    try {
		        WL.JSONStore.get('sucursales').removeCollection().then(function () {
		            console.log('la coleccion sucursales se ha removido resetJsonStoreSucursales;;');
		            saveJsonStoreSucursales();
		        }).fail(function (errorObject) {
		            console.log('fail de remove resetJsonStoreSucursales1;;' + JSON.stringify(errorObject));
		            WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                    $state.go('app.home');
		        });
		    } catch (e) {
		        console.log('error resetJsonStoreSucursales;;' + e);
		        WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                $state.go('app.home');
		    }
		} else {
		    console.log('== undefined ::');
		    */
		    WL.JSONStore.init(collections, optionsIni)
		    .then(function () {
		        //handle success
		        try {
		            WL.JSONStore.get('sucursales').removeCollection().then(function () {
		                console.log('la coleccion sucursales se ha removido resetJsonStoreSucursales;;');
		                saveJsonStoreSucursales();
		            }).fail(function (errorObject) {
		                console.log('fail de remove resetJsonStoreSucursales2;;' + JSON.stringify(errorObject));
		                WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                        $state.go('app.home');
		            });
		        } catch (e) {
		            console.log('error resetJsonStoreSucursales;;' + e);
		            WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                    $state.go('app.home');
		        }
		    })
		    .fail(function (errorObject) {
		        //handle failure
		        console.log('no function resetJsonStoreSucursales;;');
		        WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                $state.go('app.home');
		    });
		/*    
		}
		*/
	}
})
;
