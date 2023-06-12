axios.defaults.headers.common['Authorization'] = 'RemO3eOh1dT1W5imRPVKUR8m';
let usuario;
let timerManterAtivoId, timerBuscarMensagemID;
let mensagens = [];
let usuarios = [];


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
  pegarUsuarios();
  timerManterAtivoId = setInterval(manterAtivo, 5000);
  timerBuscarMensagemID = setInterval(buscarMensagens, 3000);
  timerBuscarMensagemID = setInterval(pegarUsuarios, 3000);

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
         `<li data-test="message" class="listyle">
            <p  >
                <span  >(${mensagem.time}) </span>
                <strong class="space"  >  ${mensagem.from} </strong>  para <strong>${mensagem.to}</strong>: ${mensagem.text}
            </p>
        </li>`
      }
      if(mensagem.type === 'status'){
        listaMensagensHTML += 
        `<li data-test="message" class="listyle status">
            <p  >
                <span> (${mensagem.time}) </span>
                <strong class="space"  > ${mensagem.from} </strong> ${mensagem.text} 
            </p>
        </li>`
      }

      if(mensagem.type === 'private_message'){
        listaMensagensHTML +=
         `<li data-test="message" class="listyle privado">
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
  axios.post('https://mock-api.driven.com.br/api/vm/uol/messages' , data).then((resposta) => {
    buscarMensagens();
    inputMensagens.value = '';
  }).catch((erro) => {
    window.location.reload();
    console.log('erro', erro);
  })
}

function selecionarUsuario(elemento, usuario){ 
    console.log(elemento, usuario)
    const icones = document.querySelectorAll('div.usuarios > div > .selecionado-icone')
    console.log(icones)
    icones.forEach(elemento =>   elemento.classList.add('esconder'))

    elemento.querySelector('.selecionado-icone').classList.remove('esconder')

}

function selecionarVisibilidade(elemento, tipo){ 
    console.log(elemento, tipo)
}

function pegarUsuarios(){
    const elementoListaUsuario = document.querySelector('div.usuarios')
    let elemntosDaLista =  `<div onclick="selecionarUsuario(this, 'Todos')">
     <div data-test="all" >
         <ion-icon class="icones" name="people"></ion-icon>                        
         <p>Todos</p>
        </div>
     <ion-icon class="selecionado-icone icones " name="checkmark-sharp"></ion-icon>
    </div>`
    axios.get('https://mock-api.driven.com.br/api/vm/uol/participants').then(resposta => {
        console.log('resposta usuario', resposta)
        if(usuarios.length != resposta.data.length){
            usuarios = resposta.data
            usuarios.forEach(usuario => { 
                elemntosDaLista += `<div data-test="participant" onclick="selecionarUsuario(this, '${usuario.name}')">
                <div>
                <ion-icon  class="icones" name="person-circle"></ion-icon>
                <p>${usuario.name}</p>
                </div>
                <ion-icon class="selecionado-icone icones esconder" name="checkmark-sharp"></ion-icon>
                </div> `
            });
            console.log('elemntosDaLista', elemntosDaLista)
            elementoListaUsuario.innerHTML = elemntosDaLista 
        }
    })

    
   
}


const inputMensagens = document.querySelector('input');
inputMensagens.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    enviarMensagem();
  }
});
