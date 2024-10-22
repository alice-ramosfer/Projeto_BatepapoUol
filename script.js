// d359a958-9024-4da4-b388-2f0fcac9ac0d
const uiid = "436a639b-79ed-47c6-a5c9-b7191e87f215";
let mensagem=[];
let nome_usuario;
let nome_contato = "Todos";
let visibilidade = "Público";


function abrirMenu(botao){
    const tela_menu = document.querySelector(".menu_lateral");
    const fundo=document.querySelector(".fundo");

    if (botao.name === "people"){
        tela_menu.classList.add("abrir_menu_lateral");
        fundo.classList.add("abrir_menu_lateral");
    }
    else if (botao.name === "fundo"){
        tela_menu.classList.remove("abrir_menu_lateral");
        fundo.classList.remove("abrir_menu_lateral");
    }
}

function selecionaContato(botao){
    const selecionadoAntes = document.querySelector(".contato .icone_selecionado");
    const bota_selecionado = document.querySelector(".botao_selec")
    if (selecionadoAntes !== null){
        selecionadoAntes.remove();
        bota_selecionado.classList.remove("botao_selec");
    }
    botao.innerHTML+= `<ion-icon name="checkmark-sharp" class=" icone_selecionado"></ion-icon>`;
    botao.classList.add("botao_selec")
    const select_contato = botao.querySelector(".especificacao_contato");
    nome_contato = select_contato.innerHTML;
    tipoDeMensagem();
 
}

function selecionaVisbilidade(botao){
    const selecionadoAntes = document.querySelector(".visibilidade .icone_selecionado");
    if (selecionadoAntes !== null){
        selecionadoAntes.remove();
    }
    botao.innerHTML+= `<ion-icon name="checkmark-sharp" class=" icone_selecionado"></ion-icon>`;
    const select_visibilidade = botao.querySelector(".especificacao_contato");
    visibilidade = select_visibilidade.innerHTML;
    tipoDeMensagem();
}

function tipoDeMensagem(){
    const texto = document.querySelector(".tipo_mensagem");
    texto.innerHTML = `Enviando para ${nome_contato} (${visibilidade})`;
}


function entrarSala (){ 
    nome_usuario = prompt("Digite seu nome");
    const participantes = axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/${uiid}`);
    participantes.then(response => {
        let verifica_nome = "";
        const nomes_participantes = response.data;
        for (let i = 0; i < nomes_participantes.length; i++){
            if (nomes_participantes[i].name ===  nome_usuario){
                verifica_nome = "Já existe";
            }
        }

        if (verifica_nome === ""){
            const promessa_post = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/${uiid}`, {name: nome_usuario} );
            promessa_post.then(() => {
                atualizarChat();
                setTimeout(() => {
                    scroll();
                }, 2000);
                participantesChat();
            });

        }
        else if (verifica_nome === "Já existe"){
            alert("Esse nome de usário ja existe, favor escolher outro");
            window.location.reload();

        }
    })
    participantes.catch(error => {
        console.error("Erro ao entrar na sala: ", error);
    });

}

function atualizarChat(){
    const promessa_get = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/${uiid}`);
    promessa_get.then(entrouSala);
    promessa_get.catch(error => {
        console.error("Erro ao atualizar o char: ", error);
    });

}


function entrouSala(mensagem_ser){
    mensagem = mensagem_ser.data;
    const mostra_entrar_sala = document.querySelector(".chat");
    mostra_entrar_sala.innerHTML="";

    for (let i = 0; i<mensagem.length; i++){

        if (mensagem[i].type === "private_message" && (mensagem[i].to == nome_usuario || nome_usuario == mensagem[i].from)){ 
             mostra_entrar_sala.innerHTML += `
                <div class="mensagem mensagem_privada">
                    <span class="hora">(${mensagem[i].time})</span>
                    <span class="nome">${(mensagem[i].from.replace(/['"]/g, '').trim())}</span>
                    <span class="texto"> reservadamente para </span>
                    <span class="nome">${mensagem[i].to}</span>
                    <span class="texto">: ${mensagem[i].text}</span>
                </div>
              `;
 
        }
        else if(mensagem[i].text === "entra na sala..." || mensagem[i].text === "sai da sala..." ){
            mostra_entrar_sala.innerHTML += `
                <div class="mensagem mensagem_entra_sai">
                    <span class="hora">(${mensagem[i].time})</span>
                    <span class="nome">${(mensagem[i].from.replace(/['"]/g, '').trim())}:</span>
                    <span class="texto">${mensagem[i].text}</span>
                </div>
            `;

        } else if(mensagem[i].type === "message"){
            mostra_entrar_sala.innerHTML += `
                <div class="mensagem mensagem_publica">
                    <span class="hora">(${mensagem[i].time})</span>
                    <span class="nome">${(mensagem[i].from.replace(/['"]/g, '').trim())}</span>
                    <span class="texto">para</span>
                    <span class="nome">${(mensagem[i].to.replace(/['"]/g, '').trim())}</span>
                    <span class="texto">: ${mensagem[i].text}</span>
                </div>
            `;
        }
        
    }

}
 

function participantesChat(){
    const promessa = axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/${uiid}`);
    promessa.then(response => {
        const participantes = response.data;
        const nome_menu = document.querySelector(".container_botao");

        nome_menu.innerHTML = "";
        nome_menu.innerHTML = `
                <button onclick="selecionaContato(this)">
                    <ion-icon name="people"></ion-icon>
                    <span class="especificacao_contato">Todos</span>

                </button>
            `;
    
        for (let i = 0; i < participantes.length; i++) {
            nome_menu.innerHTML += `
                <button onclick="selecionaContato(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <span class="especificacao_contato">${participantes[i].name}</span>
                </button>
            `;
        }
    })
    promessa.catch(error => {
        alert.error("Erro ao carregar participantes: ", error);
    });


}

function scroll(){
    const mostra_entrar_sala = document.querySelector(".chat");
    const ultimaMensagem = mostra_entrar_sala.lastElementChild;
    if (ultimaMensagem) {
        ultimaMensagem.scrollIntoView({ behavior: "smooth" });
    }
}


function manterConexao(){
    const promessa = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/${uiid}`, {name: nome_usuario});
    promessa.then();
    promessa.catch(error => {
        alert.error("Erro ao mater a conexão: ", error);
    });
}


function enviarMensagem(){
    const mensagem = document.getElementById('input');
    const texto = mensagem.value;
    let tipo;

    if (visibilidade === "Público"){
        tipo = "message";
    }else if (visibilidade === "Reservadamente"){
        tipo = "private_message";
    }

    const promessa = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages/${uiid}`, {
        from: nome_usuario,
        to: nome_contato,
        text: texto,
        type: tipo
    });

    promessa.then(response => { 
        mensagem_nova = true;
        atualizarChat();
        scroll();
        mensagem.value = "";
    });

    promessa.catch(() => window.location.reload());

}

function limparTexto(input) {
    input.placeholder = ""; 
}

function restaurarTexto(input) {
    if (input.value === "") {
        input.placeholder = "Escreva aqui..."; 
    }
}

entrarSala();
setInterval(manterConexao, 5000);
setInterval(atualizarChat, 3000);
setInterval(participantesChat, 10000);
