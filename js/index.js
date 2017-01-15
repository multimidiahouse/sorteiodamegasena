// JavaScript Document
var index = {
	jogo: new String(),
	quantidade: new Number(),
	html: new String(),
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