// JavaScript Document
var index = {
	jogo: new String(),
	quantidade: new Number(),
	html: new String(),
	initialize: function(){
		document.addEventListener('deviceready', index.onDeviceReady, false);
	},
	onDeviceReady: function() {
		index.initAd();
		index.showBannerFunc();
		index.showInterstitialFunc();
		var numeros = index.sorteio('megasena');
		for(i=0;i<numeros.length;i++)
			document.write('<div class="numerosdasorte">'+numeros[i]+'</div>');
	},
	initAd: function(){
			if ( window.plugins && window.plugins.AdMob ) {
				var ad_units = {
					ios : {
						banner: 'ca-app-pub-5075057333402288/2294971952',		//PUT ADMOB ADCODE HERE 
						interstitial: 'ca-app-pub-5075057333402288/7922703150'	//PUT ADMOB ADCODE HERE 
					},
					android : {
						banner: 'ca-app-pub-5075057333402288/2294971952',		//PUT ADMOB ADCODE HERE 
						interstitial: 'ca-app-pub-5075057333402288/7922703150'	//PUT ADMOB ADCODE HERE 
					}
				};
				var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
	 
				window.plugins.AdMob.setOptions( {
					publisherId: admobid.banner,
					interstitialAdId: admobid.interstitial,
					adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD 
					bannerAtTop: true, // set to true, to put banner at top 
					overlap: true, // banner will overlap webview  
					offsetTopBar: false, // set to true to avoid ios7 status bar overlap 
					isTesting: true, // receiving test ad 
					autoShow: true // auto show interstitial ad when loaded 
				});
	 
				index.registerAdEvents();
				window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown 
				window.plugins.AdMob.requestInterstitialAd();
	 
			} else {
				//alert( 'admob plugin not ready' ); 
			}
	},
	registerAdEvents: function() {
			document.addEventListener('onReceiveAd', function(){});
			document.addEventListener('onFailedToReceiveAd', function(data){});
			document.addEventListener('onPresentAd', function(){});
			document.addEventListener('onDismissAd', function(){ });
			document.addEventListener('onLeaveToAd', function(){ });
			document.addEventListener('onReceiveInterstitialAd', function(){ });
			document.addEventListener('onPresentInterstitialAd', function(){ });
			document.addEventListener('onDismissInterstitialAd', function(){
				window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW 
				window.plugins.AdMob.requestInterstitialAd();			//get the next one ready only after the current one is closed 
			});
	},
	showBannerFunc: function(){
		window.plugins.AdMob.createBannerView();
	},
	showInterstitialFunc: function(){
		window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown and show when it's loaded. 
		window.plugins.AdMob.requestInterstitialAd();
	},
	sorteio: function(jogo){
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
		jogo = $("#jogo").val();
		quantidade = $("#quantidade").val();
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
		$("#cartelas").html(html);
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
}