var app = {
    // global vars
	jogo: new String(),
	quantidade: new Number(),
	valorTotalDaAposta: new Number(),
	valorMegasena: new Number(3.5),
	valorQuina: new Number(1),
    autoShowInterstitial: false,
    progressDialog: document.getElementById("progressDialog"),
    spinner: document.getElementById("spinner"),
    weinre: {
        enabled: false,
        ip: '', // ex. http://192.168.1.13
        port: '', // ex. 9090
        targetApp: '' // ex. see weinre docs
    },

    // Application Constructor
    initialize: function () {
        if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    },
    // Must be called when deviceready is fired so AdMobAds plugin will be ready
    initAds: function () {
        var isAndroid = (/(android)/i.test(navigator.userAgent));
		var adPublisherIds = {
			//ios: {
			//	banner: 'ca-app-pub-9863325511078756/5232547029',
			//	interstitial: 'ca-app-pub-9863325511078756/6709280228'
			//},
            android: {
                banner: 'ca-app-pub-5075057333402288/2294971952',
                interstitial: 'ca-app-pub-5075057333402288/7922703150'
            }
        };
        var admobid;

        if (isAndroid) {
            admobid = adPublisherIds.android;
        } else {
            admobid = adPublisherIds.ios;
        }
        if (window.admob) {
            admob.setOptions({
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                bannerAtTop: false, // set to true, to put banner at top
                overlap: false, // set to true, to allow banner overlap webview
                offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
                isTesting: false, // receiving test ads (do not test with real ads as your account will be banned)
                autoShowBanner: true, // auto show banners ad when loaded
                autoShowInterstitial: false // auto show interstitials ad when loaded
            });
			app.startBannerAds();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    // Bind Event Listeners
    bindAdEvents: function () {
        if (window.admob) {
            document.addEventListener("orientationchange", this.onOrientationChange, false);
            document.addEventListener(admob.events.onAdLoaded, this.onAdLoaded, false);
            document.addEventListener(admob.events.onAdFailedToLoad, this.onAdFailedToLoad, false);
            document.addEventListener(admob.events.onAdOpened, function (e) { }, false);
            document.addEventListener(admob.events.onAdClosed, function (e) { }, false);
            document.addEventListener(admob.events.onAdLeftApplication, function (e) { }, false);
            document.addEventListener(admob.events.onInAppPurchaseRequested, function (e) { }, false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },

    // -----------------------------------
    // Events.
    // The scope of 'this' is the event.
    // -----------------------------------
    onOrientationChange: function () {
        app.onResize();
    },
    onDeviceReady: function () {
		//Credencial Google Cloud Message
		//AIzaSyCYUNsx6q2vMTwDj1TLiss45YM6F1K5Lpk
		var push = PushNotification.init({
			android: {
				senderID: "571570324698"
			},
			browser: {
				pushServiceURL: 'http://push.api.phonegap.com/v1/push'
			},
			ios: {
				//alert: "true",
				//badge: "true",
				//sound: "true"
			},
			windows: {}
		});

		push.on('registration', function(data) {
			// data.registrationId
			console.log('register');
		});

		push.on('notification', function(data) {
			console.log('notification');
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
		});

		push.on('error', function(e) {
			console.log(e);
			// e.message
		});
		
		console.log(push);
		
        var weinre,
            weinreUrl;

        document.removeEventListener('deviceready', app.onDeviceReady, false);

        if (app.weinre.enabled) {
            console.log('Loading weinre...');
            weinre = document.createElement('script');
            weinreUrl = app.weinre.ip + ":" + app.weinre.port;
            weinreUrl += '/target/target-script-min.js';
            weinreUrl += '#' + app.weinre.targetApp;
            weinre.setAttribute('src', weinreUrl);
            document.head.appendChild(weinre);
        }

        if (window.admob) {
            //console.log('Binding ad events...');
			//alert('Binding ad events...');
            app.bindAdEvents();
            //console.log('Initializing ads...');
			//alert('Initializing ads...');
            app.initAds();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
		
		//app.numerosdasorte();
		app.consultaSorteio();
    },
    onAdLoaded: function (e) {
        app.showProgress(false);
        if (window.admob && e.adType === window.admob.AD_TYPE.INTERSTITIAL) {
            if (app.autoShowInterstitial) {
                window.admob.showInterstitialAd();
            } else {
                alert("Interstitial is available. Click on 'Show Interstitial' to show it.");
            }
        }
    },
    onAdFailedToLoad: function (e) {
        app.showProgress(false);
        alert("Could not load ad: " + JSON.stringify(e));
    },
    onResize: function () {
        var msg = 'Web view size: ' + window.innerWidth + ' x ' + window.innerHeight;
        document.getElementById('sizeinfo').innerHTML = msg;
    },

    // -----------------------------------
    // App buttons functionality
    // -----------------------------------
    startBannerAds: function () {
        if (window.admob) {
            app.showProgress(true);
            window.admob.createBannerView(function () { app.showBannerAds(); }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    removeBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.destroyBannerView();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(true,
				function ()
				{
				},
				function (e) 
				{
					alert(JSON.stringify(e));
				}
			);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    hideBannerAds: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showBannerAd(false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    requestInterstitial: function (autoshow) {
        if (window.admob) {
            app.showProgress(true);
            app.autoShowInterstitial = autoshow;
            window.admob.requestInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showInterstitial: function () {
        if (window.admob) {
            app.showProgress(false);
            window.admob.showInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showProgress: function (show) {
        if (show) {
            addClass(app.spinner, "animated");
            removeClass(app.progressDialog, "hidden");
        } else {
            addClass(app.progressDialog, "hidden");
            removeClass(app.spinner, "animated");
        }
    },
	sorteio: function(jogo) {
		marcacao = 0;
		numeros = 0;
		
		switch(jogo)
		{
		   case 'megasena':
			  marcacao = 6;
			  numeros = 60;
			  break;
		   case 'quina':
			  marcacao = 5;
			  numeros = 80;
			  break;
		}

		vector = new Array();
		for(i=0;i<marcacao;i++)
		{
			number = Math.floor((Math.random() * 60) + 1);
			while(vector.indexOf(number) >= 0)
				number = Math.floor((Math.random() * 60) + 1);
			vector.push(number);
		}
		vector.sort();
		return vector;

	},
	cartelas: function() {
		app.valorTotalDaAposta = 0;
		var jogo = document.getElementById("jogo").value;
		var quantidade = document.getElementById("quantidade").value;
		var linhas = 0;
		var colunas = 0;
		switch(jogo)
		{
		   case 'megasena':
			  linhas = 6;
			  colunas = 10;
			  break;
		   case 'quina':
			  linhas = 8;
			  colunas = 10;
			  break;
		}
		var numerosdasorte = document.getElementById("cartelas");
		numerosdasorte.innerHTML = '';
		for(cartela=0;cartela<quantidade;cartela++)
		{
			var divCartela = document.createElement('div');
			divCartela.className = 'jogo';
			for(table=0;table<2;table++)
			{
				numeros = this.sorteio(jogo);
				acerto = new Number(1);
				var table = document.createElement('table');
				for(i=0;i<linhas;i++)
				{
					var tr = document.createElement('tr');
					for(y=0;y<colunas;y++)
					{
						var td = document.createElement('td');
						var text = document.createTextNode(acerto);
						if(numeros.indexOf(acerto) >= 0)
							td.style.background = '#fc9103';
						var att = document.createAttribute("onclick");
						att.value = "app.mudaAposta(this);";
						td.setAttributeNode(att);
						td.appendChild(text);
						tr.appendChild(td);
						acerto++;
					}
					acerto--;
					table.appendChild(tr);
					acerto++;
				}
				divCartela.appendChild(table);
				var valor = document.createElement('div');
				valor.setAttribute('id','cartela'+cartela);
				valor.style.background = '#fc9103';
				valor.style.fontSize = '2em';
				if(jogo == 'megasena')
					valor.innerHTML = 'R$ '+app.valorMegasena.toLocaleString('en-IN', { minimumFractionDigits:2 });
				else
					valor.innerHTML = 'R$ '+app.valorQuina.toLocaleString('en-IN', { minimumFractionDigits:2 });;
				divCartela.appendChild(valor);
			}
			numerosdasorte.appendChild(divCartela);
			if(jogo == 'megasena')
				app.valorTotalDaAposta = app.valorTotalDaAposta + app.valorMegasena;
			else
				app.valorTotalDaAposta = app.valorTotalDaAposta + app.valorQuina;
		}
		var valor = document.createElement('div');
		valor.setAttribute('id','valorTotalDaAposta');
		valor.style.fontSize = '2em';
		valor.innerHTML = 'R$ '+app.valorTotalDaAposta.toLocaleString('en-IN', { minimumFractionDigits: 2 });
		numerosdasorte.appendChild(valor);
	},
	numerosdasorte: function() {
		document.getElementById("cartelas").innerHTML = '<p>Seus números da sorte são:</p>';
		var numeros = app.sorteio('megasena');
		for(i=0;i<numeros.length;i++)
		{
			var numerosdasorte = document.createElement('div');
			numerosdasorte.className = "numerosdasorte";
			var numerosorteado = document.createTextNode(numeros[i]);
			numerosdasorte.appendChild(numerosorteado);
			document.getElementById("cartelas").appendChild(numerosdasorte);
		}
	},
	showAndHide: function(obj){
		if($(".numeros").css('display') == 'none')
		{
			$(".numeros").css('display','block');
			$(".cartela").css('display','none');
			$(obj).html('Ver Cartela');
		}
		else
		{
			$(".numeros").css('display','none');
			$(".cartela").css('display','block');
			$(obj).html('Ver Números');
		}
	},
	mudaAposta: function(obj) {
		
		var jogo = document.getElementById("jogo").value;
		
		if(obj.style.background == 'rgb(252, 145, 3)')
			obj.style.background = '';
		else
			obj.style.background = 'rgb(252, 145, 3)';
		
		var contN = new Number();
		tr = obj.parentElement;
		table = tr.parentElement;
		div = table.parentElement;
		a = table.childNodes;
		for(i=0;i<a.length;i++)
		{
			b = a[i].childNodes;
			for(j=0;j<b.length;j++)
				if(b[j].style.background == 'rgb(252, 145, 3)')
					contN++;
		}
		
		valorDoJogo = div.getElementsByTagName('div');
		valorDoJogo = valorDoJogo[0];
		
		valorTotal = new String();
		valorTotal = valorDoJogo.innerHTML;
		if(valorTotal == 'Não é possível realizar esse jogo')
		{
			valorTotal = new Number(0);
		}
		else
		{
			//valorTotal = valorTotal.split(' ');
			valorTotal = valorTotal.replace('R$','');
			valorTotal = valorTotal.replace(',','');
			//valorTotal = valorTotal[1].replace('.','');
			//valorTotal = parseFloat(valorTotal.replace(',','.'));
			valorTotal = parseFloat(valorTotal);
		}

		app.valorTotalDaAposta = app.valorTotalDaAposta - valorTotal;

		if(jogo == 'megasena')
		{
			switch(contN)
			{
				case 6:
					valorTotal = 3.50;
					break;
				case 7:
					valorTotal = 24.50;
					break;
				case 8:
					valorTotal = 98.00;
					break;
				case 9:
					valorTotal = 294.00;
					break;
				case 10:
					valorTotal = 735.00;
					break;
				case 11:
					valorTotal = 1617.00;
					break;
				case 12:
					valorTotal = 3234.00;
					break;
				case 13:
					valorTotal = 6006.00;
					break;
				case 14:
					valorTotal = 10510.50;
					break;
				case 15:
					valorTotal = 17517.50;
					break;
				default:
					valorTotal = new String('Não é possível realizar esse jogo');
					break;
			}
		}
		else
		{
			switch(contN)
			{
				case 5:
					valorTotal = 1;
					break;
				case 6:
					valorTotal = 4;
					break;
				case 7:
					valorTotal = 10;
					break;
				default:
					valorTotal = new String('Não é possível realizar esse jogo');
					break;
			}
		}
		
		if(valorTotal != 'Não é possível realizar esse jogo')
		{
			valorDoJogo.innerHTML = 'R$ '+valorTotal.toLocaleString('en-IN', { minimumFractionDigits:2 });
			app.valorTotalDaAposta = app.valorTotalDaAposta + valorTotal;
		}
		else
		{
			valorDoJogo.innerHTML = 'Não é possível realizar esse jogo';
		}
		
		totalDaAposta = document.getElementById('valorTotalDaAposta');
		totalDaAposta.innerHTML = 'R$ '+app.valorTotalDaAposta.toLocaleString('en-IN', { minimumFractionDigits:2 });
	},
	consultaSorteio: function() {
		document.getElementById("cartelas").innerHTML = '<p>Carregando...</p>';
		$.ajax({
			method: "POST",
			dataType: "json",
			crossDomain: true,
			url: "http://www.multimidiahouse.com.br/mega/resultados/",
			statusCode: {
				404: function() {
					//console.log('not found');
				},
				503: function(xhr) {
					//console.log('invalid');
				},
				200: function() {
					//console.log('found');
				}
			},
			success: function(data){
				//console.log(data);
			}
		})
		.done(function(obj) {
			var len = obj.length;
			var sorteio = obj[len-1];
			
			document.getElementById("cartelas").innerHTML = '<p>Números sorteados no Concurso N°:'+sorteio.CONCURSO+' '+sorteio.DATADOSORTEIO+' </p>';
			var numeros = new Array(sorteio.DEZENA1,sorteio.DEZENA2,sorteio.DEZENA3,sorteio.DEZENA4,sorteio.DEZENA5,sorteio.DEZENA6);
			for(i=0;i<numeros.length;i++)
			{
				var numerosdasorte = document.createElement('div');
				numerosdasorte.className = "numerosdasorte";
				var numerosorteado = document.createTextNode(numeros[i]);
				numerosdasorte.appendChild(numerosorteado);
				document.getElementById("cartelas").appendChild(numerosdasorte);
			}
			if(sorteio.ACUMULOU == 'S')
			{
				var acumulou = document.createElement('div');
				var acumulado = document.createTextNode('Acumulou! Estimativa de prêmio do próximo concurso: R$ ' + sorteio.VALORACUMULADO);
				acumulou.appendChild(acumulado);
				document.getElementById("cartelas").appendChild(acumulou);
			}
			
			for(i=0;i<len;i++)
			{
				var concursos = document.createElement('div');
				concursos.id = obj[i].CONCURSO;
				concursos.className = 'concursos';
				var att = document.createAttribute("onclick");
				att.value = "app.hide(this);";
				concursos.setAttributeNode(att);
				
				//Concurso
				var p = document.createElement("p");
				var txt = document.createTextNode("Concurso N°: "+obj[i].CONCURSO);
				p.appendChild(txt);
				concursos.appendChild(p);
				//Data do Concurso
				var p = document.createElement("p");
				var txt = document.createTextNode("Data do Sorteio "+obj[i].DATADOSORTEIO);
				p.appendChild(txt);
				concursos.appendChild(p);
				//Numeros
				var p = document.createElement("p");
				var txt = document.createTextNode(obj[i].DEZENA1 + ' - ' + obj[i].DEZENA2 + ' - ' + obj[i].DEZENA3 + ' - ' + obj[i].DEZENA4 + ' - ' + obj[i].DEZENA5 + ' - ' + obj[i].DEZENA6);
				p.appendChild(txt);
				concursos.appendChild(p);
				document.getElementById("cartelas").appendChild(concursos);
			}
		});
	},
	mostraConcurso: function() {
		var concurso = prompt("Digite o n° do concurso");
		if (concurso != null) {
			if(document.getElementById(concurso))
			{
				var div = document.getElementById(concurso);
				div.style.display = 'block';
			}
			else
			{
				alert('Concurso não realizado');
			}
		}
	},
	hide: function(obj) {
		obj.style.display = 'none';
	}
};

function removeClass(elem, cls) {
    var str;
    do {
        str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    } while (str.match(cls));
}

function addClass(elem, cls) {
    elem.className += (" " + cls);
}
