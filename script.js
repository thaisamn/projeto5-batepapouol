axios.defaults.headers.common['Authorization'] = 'RemO3eOh1dT1W5imRPVKUR8m';
let usuario;
let timerManterAtivoId, timerBuscarMensagemID;
let mensagens = [];


function verUltimMensagem(){   
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

function loginDoUsuario(){
    const input = document.querySelector("#nomeUsuario")
    const nomeDeLogin = input.value
    const dadosLogin = {
        name: nomeDeLogin
      };
    axios.post('https://mock-api.driven.com.br/api/vm/uol/participants' , dadosLogin)
    .then((resposta) => {
          console.log('resposta axios', resposta);
          toggleTelaInicial();
          verUltimMensagem();
    }).catch((erro) => {
      loginDoUsuario();
    })

    usuario = dadosLogin
    iniciarBatePapo();
};

function toggleTelaInicial() {
    const telaIncial = document.querySelector(".pagina-inicial")
    telaIncial.classList.toggle('esconder')
}

function togglePaginaParticipantes(){
    const telaIncial = document.querySelector(".pagina-participantes")
    telaIncial.classList.toggle('esconder')
    
}



function manterAtivo(){
  axios.post('https://mock-api.driven.com.br/api/vm/uol/status' , usuario).then((resposta) => {
  }).catch((erro) => {
    console.log('erro', erro);
  })

};

function iniciarBatePapo(){
  buscarMensagens();
  timerManterAtivoId = setInterval(manterAtivo, 5000);
  timerBuscarMensagemID = setInterval(buscarMensagens, 3000);

}

function buscarMensagens(){
  console.log("🚀 ~ file: script.js:38 ~ buscarMensagens ~ buscarMensagens:", 'buscarMensagens')
  let novasMensagens = []
  axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
    .then((resposta) => {
      criandoListaDeMensagens(resposta.data);
    })
    .catch((erro) => {
        console.log('erro', erro);
    })
}


function criandoListaDeMensagens(novasMensagens){
    const batePapo = document.querySelector('ul');
    let listaMensagensHTML = "";

    novasMensagens.forEach((mensagem) => {
      if(mensagem.type === 'message'){
        listaMensagensHTML +=
         `<li class="listyle">
            <p  >
                <span  >(${mensagem.time}) </span>
                <strong class="space"  >  ${mensagem.from} </strong>  para <strong>${mensagem.to}</strong>: ${mensagem.text}
            </p>
        </li>`
      }
      if(mensagem.type === 'status'){
        listaMensagensHTML += 
        `<li class="listyle status">
            <p  >
                <span> (${mensagem.time}) </span>
                <strong class="space"  > ${mensagem.from} </strong> ${mensagem.text} 
            </p>
        </li>`
      }

      if(mensagem.type === 'private_message'){
        listaMensagensHTML +=
         `<li class="listyle privado">
            <p>
                 <span >(${mensagem.time}) </span>
                 <strong class="space" >  ${mensagem.from} </strong> para  <strong  >${mensagem.to}</strong>: ${mensagem.text}
            </p>
         </li>`
      }
    })
    
    batePapo.innerHTML = listaMensagensHTML;
}

function enviarMensagem(){
  const inputMensagens = document.querySelector('input.mensagem');
  const data = {
    from: usuario.name,
    to: "Todos",
    text: inputMensagens.value,
    type: "message"
  };
  console.log("🚀 ~ file: script.js:106 ~ enviarMensagem ~ data.inputMensagens.value:",inputMensagens.value);
  axios.post('https://mock-api.driven.com.br/api/vm/uol/messages' , data).then((resposta) => {
    console.log("🚀 ~ file: script.js:109 ~ axios.post ~ resposta:", resposta);
    buscarMensagens();
    inputMensagens.value = '';
  }).catch((erro) => {
    window.location.reload();
    console.log('erro', erro);
  })
}


const inputMensagens = document.querySelector('input');
inputMensagens.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    enviarMensagem();
  }
});
