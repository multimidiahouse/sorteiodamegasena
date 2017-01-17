var app = {
    // global vars
	jogo: new String(),
	quantidade: new Number(),
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
                isTesting: true, // receiving test ads (do not test with real ads as your account will be banned)
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
					var numeros = app.sorteio('megasena');
					for(i=0;i<numeros.length;i++)
					{
						//document.getElementById("cartelas").remove();
						document.getElementById("cartelas").appendChild('<div class="numerosdasorte">'+numeros[i]+'</div>');
					}
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
	cartelas: function(jogo, quantidade) {
		html = '';
		jogo = document.getElementById("jogo").value;
		quantidade = document.getElementById("quantidade").value;
		linhas = 0;
		colunas = 0;
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
		
		for(cartela=0;cartela<quantidade;cartela++)
		{
			html += '<div style="float:left; margin-left:5px; margin-right:5px; margin-top:10px; margin-bottom:20px; border:1px solid gray;">';
			for(table=0;table<2;table++)
			{
				numeros = index.sorteio(jogo);
				html += '<div class="numeros" style="display:none;">'+numeros.toString()+'</div>';
				acerto = new Number(1);
				html += '<div class="cartela"><table>';
				for(i=0;i<linhas;i++)
				{
					html += '<tr>';
					for(y=0;y<colunas;y++)
					{
						if(numeros.indexOf(acerto) >= 0)
							html += '<td bgcolor="#fc9103">'+acerto+'</td>';
						else
							html += '<td>'+acerto+'</td>';
						acerto++;
					}
					acerto--;
					html += '</tr>';
					acerto++;
				}
				if(table == 0)
					html += '<tr><td colspan="10">Aposte que vai da certo</td></tr>';
				html += '</table></div>';
			}
			html += '</div>';
		}
		html += '<div style="margin:20px; clear:both;"><a id="numeros" data-role="button" onclick="index.showAndHide(this);">Ver Números</a></div>';
		html += '<div style="margin:20px; clear:both;"><a data-role="button" href="#homepage">Jogar</a></div>';
		document.getElementById("cartelas").remove();
		document.getElementById("cartelas").appendChild(html);
		//$("#cartelas").html(html);
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
