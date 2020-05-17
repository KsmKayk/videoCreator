## Video Creator

> Automatizador de criação de videos para o youtube, utilizando - API'S do Google, IBM e Wikipedia

Projeto baseado nas aulas do **[Felipe Deschamps](https://youtu.be/kjhu1LEmRpY)** no Youtube.

***Resumo do projeto***
4 bots que automatizarão a criação e postagem do video.
1 - pesquisar e tratar texto
2 - pesquisar e tratar imagem
3 - compor e exportar o video
4 - configurar a postagem no youtube e postar

> Explicação e uso abaixo do projeto oficial do Felipe

***Como usar***

Por  [Hebert Lima](https://github.com/hebertlima)

Estou vendo que alguns devs aqui estão com problemas para rodar o projeto, talvez por que alguns não estão acompanhando a serie no  [YouTube](https://www.youtube.com/watch?v=kjhu1LEmRpY&list=PLMdYygf53DP4YTVeu0JxVnWq01uXrLwHi)  e por pegarem o "bonde andando" estão pulando algumas etapas do projeto e indo direto para o  `node index.js`, então aqui vai a transcrição do passo-a-passo (que está sendo explicado nos vídeos) detalhado de como rodar o projeto para os desavisados de primeira viagem  😜

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#start)Start

Vou partir do princípio que você caiu na playlist e é aspirantes a programação e não está familiarizados com o  **Git**  ou  **Node.js**, então primeiro você precisa instalar o  [Node.js](https://nodejs.org/en/)  no seu pc e seguir o procedimento padrão de instalação  **next->next->ok**, recomendo você baixar o  [Git](https://git-scm.com/downloads)  e instalar na sua maquina, depois basta copiar a URL do projeto conforme abaixo:

[![Start](https://camo.githubusercontent.com/af375984c24ab9d077a76429b3bde8035aadfcc7/68747470733a2f2f692e696d67736166652e6f72672f63622f636230646161363564662e676966)](https://camo.githubusercontent.com/af375984c24ab9d077a76429b3bde8035aadfcc7/68747470733a2f2f692e696d67736166652e6f72672f63622f636230646161363564662e676966)

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#clonando-o-reposit%C3%B3rio)Clonando o Repositório

Com o Git e o Node.js instalado na sua maquina e a  **URL**  do projeto em mãos, cria em algum lugar do seu pc uma pasta para criarmos uma copia do repositório, dentro dela abra o  **cmd**  ou  **powershell**  e digite os comandos abaixo:

```
git clone https://github.com/filipedeschamps/video-maker.git
cd video-maker
npm install

```

[![Clone](https://camo.githubusercontent.com/3bb1defcd587d8d2be9d6717aaa3fe1fd2e3ae92/68747470733a2f2f692e696d67736166652e6f72672f63612f636165643031303038362e676966)](https://camo.githubusercontent.com/3bb1defcd587d8d2be9d6717aaa3fe1fd2e3ae92/68747470733a2f2f692e696d67736166652e6f72672f63612f636165643031303038362e676966)

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#api-algorithmia)Api: Algorithmia

É necessário criar a sua chave de acesso para poder testar os robôs, pra isso você precisa acessar o site do  [Algorithmia](https://algorithmia.com/), aqui não tem muito segredo, basta acessar e se cadastrar, depois de logar na sua conta, na Dashboard procure no menu  **Api Keys**  e  **copie**.

[![Algorithmin](https://camo.githubusercontent.com/bb28eb5b05cc9460e39b3bb5959ac6ed11d5ac9d/68747470733a2f2f692e696d67736166652e6f72672f62612f626131643233383937632e676966)](https://camo.githubusercontent.com/bb28eb5b05cc9460e39b3bb5959ac6ed11d5ac9d/68747470733a2f2f692e696d67736166652e6f72672f62612f626131643233383937632e676966)

vá até a pasta do projeto onde você clonou o repositório, navegue até a pasta  **video-maker\credentials**, crie um arquivo de texto e renomeie para  `algorithmia.json`, dentro desse arquivo você irá colocar a  `API`  que copiou do site  **Algorithmia**  na estrutura abaixo:

{
  "apiKey": "API_KEY_AQUI"
}

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#api-watson)Api: Watson

Você precisa criar também as credenciais do  _Watson_  no site da  [IBM](https://cloud.ibm.com/login), também não tem segredo, basta se cadastrar, quando estiver logado no menu superior clique em  **Catálogo**, depois dentro de  **IA**  procure por  _Natural Language Understanding_

[![IBM](https://camo.githubusercontent.com/030da0124162d46d2a2a1f1d1dd3265381fd1f13/68747470733a2f2f692e696d67736166652e6f72672f62612f626162306663346563642e6a706567)](https://camo.githubusercontent.com/030da0124162d46d2a2a1f1d1dd3265381fd1f13/68747470733a2f2f692e696d67736166652e6f72672f62612f626162306663346563642e6a706567)

clicando nele na nova página vai aparecer um botão "criar" no final da página, uma vez que o serviço for criado, você será redirecionado para a página de gerenciamento do serviço que você acabou de criar, no menu lateral esquerdo procure por  **Credenciais de Serviços**  e depois clique em  **Auto-generated service credentials**  destacado abaixo, então copie as  _Credenciais_:

[![IBM](https://camo.githubusercontent.com/476bec8ad5d78a6c9c46ddfabd24e6c1a66af3a5/68747470733a2f2f692e696d67736166652e6f72672f62612f626163653436663136622e6a706567)](https://camo.githubusercontent.com/476bec8ad5d78a6c9c46ddfabd24e6c1a66af3a5/68747470733a2f2f692e696d67736166652e6f72672f62612f626163653436663136622e6a706567)

Novamente, voltando na pasta do projeto ainda dentro da pasta  **video-maker\credentials**  você ira criar um novo arquivo de texto com o nome  `watson-nlu.json`  e dentro desse arquivo você vai colar as credenciais que copiou anteriormente:

{
  "apikey" : "...",
  "iam_apikey_description" : "...",
  "iam_apikey_name": "...",
  "iam_role_crn": "...",
  "iam_serviceid_crn": "...",
  "url": "..."
}

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#setup-google-cloud-plataform)Setup: Google Cloud Plataform

Antes de criarmos as api's que iremos utilizar é necessário vincular a nossa conta do Google com o  [Google Cloud Plataform](https://cloud.google.com/), na página do  **Google Cloud Plataform**  você irá clicar no botão  **Faça uma Avaliação Gratuita**:

[![google-cloud](https://camo.githubusercontent.com/196f6a91a03c5012332c09eb19e32220d3a98d88/68747470733a2f2f692e696d67736166652e6f72672f36312f363163653833636132322e706e67)](https://camo.githubusercontent.com/196f6a91a03c5012332c09eb19e32220d3a98d88/68747470733a2f2f692e696d67736166652e6f72672f36312f363163653833636132322e706e67)

em seguida marque a opção  **Termos e Condições**

[![google-cloud-step1](https://camo.githubusercontent.com/22e4626af43710ff65bb19fddb4a9a26ecf94b60/68747470733a2f2f692e696d67736166652e6f72672f36322f363231613264663531312e706e67)](https://camo.githubusercontent.com/22e4626af43710ff65bb19fddb4a9a26ecf94b60/68747470733a2f2f692e696d67736166652e6f72672f36322f363231613264663531312e706e67)

> Ps.: É importante lembrar que alguns recursos do  **Google Cloud Plataform**  são  **Pagos**, por esse motivo é necessário inserir as informações de pagamento, mas fique tranquilo porque iremos utilizar apenas os recursos  **Gratuitos**

[![google-cloud-pay](https://camo.githubusercontent.com/333a3b903b194bcab78bf850b7631144c3c80149/68747470733a2f2f692e696d67736166652e6f72672f36322f363235336365383134322e6a706567)](https://camo.githubusercontent.com/333a3b903b194bcab78bf850b7631144c3c80149/68747470733a2f2f692e696d67736166652e6f72672f36322f363235336365383134322e6a706567)

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#criando-o-projeto)Criando o Projeto

Agora é a hora de criarmos um projeto que iremos vincular as Api's que vamos utilizar, para isso basta clicar no menu do topo da página "**Selecionar projeto**" e depois em "**Novo Projeto**":

[![image](https://user-images.githubusercontent.com/34013325/55571155-52e3d400-56db-11e9-998f-bd99ab647403.png)](https://user-images.githubusercontent.com/34013325/55571155-52e3d400-56db-11e9-998f-bd99ab647403.png)

de um nome ao projeto e clique no botão  **criar:**

[![image](https://user-images.githubusercontent.com/34013325/55571267-963e4280-56db-11e9-9b21-7f028caa05c1.png)](https://user-images.githubusercontent.com/34013325/55571267-963e4280-56db-11e9-9b21-7f028caa05c1.png)

após isso o projeto começará a ser criado e assim que terminar um menu vai aparecer com o projeto que acabamos de criar então você irá seleciona-lo:

[![image](https://user-images.githubusercontent.com/34013325/55571506-064cc880-56dc-11e9-804b-f14003dccc09.png)](https://user-images.githubusercontent.com/34013325/55571506-064cc880-56dc-11e9-804b-f14003dccc09.png)

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#api-custom-search-api)Api: Custom Search API

Com o projeto criado agora é hora de habilitarmos e configurarmos a Api, você irá clicar no menu lateral esquerdo no topo navegar até  **API's e Serviços**  >  **Bibliotecas**:

[![image](https://user-images.githubusercontent.com/34013325/55572521-22ea0000-56de-11e9-89cc-f477fe18bf65.png)](https://user-images.githubusercontent.com/34013325/55572521-22ea0000-56de-11e9-89cc-f477fe18bf65.png)

no campo de pesquisa basta procurar por  **Custom Search API**, clicar em  **Ativar**, e aguardar até a ativação da api:

[![image](https://user-images.githubusercontent.com/34013325/55572661-78bea800-56de-11e9-9ae3-fbc87758aa84.png)](https://user-images.githubusercontent.com/34013325/55572661-78bea800-56de-11e9-9ae3-fbc87758aa84.png)

Após a ativação vai aparecer uma mensagem solicitando a criação das credenciais da API, então basta você clicar em  **Criar Credenciais**:

[![image](https://user-images.githubusercontent.com/34013325/55572835-eb2f8800-56de-11e9-8292-fc3c4bf74084.png)](https://user-images.githubusercontent.com/34013325/55572835-eb2f8800-56de-11e9-8292-fc3c4bf74084.png)

Procure por  **Custom Search API**  no dropdown e clique em "**Preciso de quais credenciais?**"

[![image](https://user-images.githubusercontent.com/34013325/55572958-2cc03300-56df-11e9-8bc1-17641ba5138e.png)](https://user-images.githubusercontent.com/34013325/55572958-2cc03300-56df-11e9-8bc1-17641ba5138e.png)

Após isso irá aparecer sua Api Key, você vai copia-la e clicar no botão concluir, voltando a pasta do projeto você vai navegar até  **video-maker/credentials**  e irá criar um novo arquivo chamado  **google-search.json**  com o conteúdo abaixo:

```
{
  "apiKey": "API_KEY_AQUI"
}

```

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#api-custom-search-enginer)Api: Custom Search Enginer

Agora iremos configurar o nosso motor de busca personalizado do google, para isso você vai acessar o  [Custom Search Engine](https://cse.google.com/cse/create/new), e irá informar o  **site a pesquisar**  coloque  **google.com**, ire selecionar o idioma que preferir  _no vídeo o Filipe deixa Inglês então aconselho deixar em inglês_, e por fim clique em  **Opções avançadas**  e para o esquema iremos utilizar o mais genérico  **Thing**, pronto tudo preenchido você irá clicar em  **criar**:

> PS.: Para saber mais sobre o schema que o Filipe cita no vídeo acesse  [schema.org](https://schema.org/docs/full.html)

[![image](https://user-images.githubusercontent.com/34013325/55578410-38662680-56ec-11e9-80ea-06ff9e25ba3f.png)](https://user-images.githubusercontent.com/34013325/55578410-38662680-56ec-11e9-80ea-06ff9e25ba3f.png)

Agora basta clicar em  **Painel de Controle**  na nova tela nós iremos habilitar a opção  **Pesquisa de imagens**  e depois iremos clicar no botão  **Copiar para área de transferência**"

[![image](https://user-images.githubusercontent.com/34013325/55574756-8a567e80-56e3-11e9-99ea-d307547c781f.png)](https://user-images.githubusercontent.com/34013325/55574756-8a567e80-56e3-11e9-99ea-d307547c781f.png)

> Ps.: Existem diversas opções que eu aconselho futuramente você testar e descobrir o que cada uma dela faz  😋

[![image](https://user-images.githubusercontent.com/34013325/55574920-0355d600-56e4-11e9-8f36-822a62224fab.png)](https://user-images.githubusercontent.com/34013325/55574920-0355d600-56e4-11e9-8f36-822a62224fab.png)

Voltando no arquivo  **google-search.json**  iremos criar uma nova propriedade e iremos colar o código identificador do mecanismo de busca que criamos, identificado por  `searchEngineId`, no final irá ficar assim:

```
{
  "apiKey": "API_KEY_AQUI",
  "searchEngineId": "ID_MECANISMO_DE_BUSCA"
}

```

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#api-youtube)Api: YouTube

Chegou a hora de configurarmos a api do youtube!, como fizemos na api custom search iremos fazer o mesmo com a api do YoutTube, então basta acessar o  [Google Cloud](https://cloud.google.com/)  e habilitar o serviço do YouTube, clicando no menu Lateral  **Apis e Serviços -> Biblioteca**, na caixa de pesquisa procure por  **YouTube**, e click no botão Ativar:

[![ezgif-5-fa13fd3c8407](https://user-images.githubusercontent.com/34013325/57034414-d08cf800-6c25-11e9-9867-03024a30028a.gif)](https://user-images.githubusercontent.com/34013325/57034414-d08cf800-6c25-11e9-9867-03024a30028a.gif)

> Ps. No vídeo o Filipe orienta a criar um novo projeto para adicionar a api do Youtube, porem aqui, estou usando o mesmo projeto que criei para o video-maker, mas caso queria criar um novo projeto basta seguir os passos de  **Criando o Projeto**  que está no começo desse guia!

Agora clique na guia  **Tela de consentimento OAuth**  [![image](https://user-images.githubusercontent.com/34013325/57034753-c0294d00-6c26-11e9-8ee9-ff5e12ea6470.png)](https://user-images.githubusercontent.com/34013325/57034753-c0294d00-6c26-11e9-8ee9-ff5e12ea6470.png)

Em seguida preencha apenas o campo "nome do aplicativo", futuramente você pode voltar aqui para personalizar com as outras informações caso desejar:

[![image](https://user-images.githubusercontent.com/34013325/57034907-1d250300-6c27-11e9-8c9f-e2e0d4e95b95.png)](https://user-images.githubusercontent.com/34013325/57034907-1d250300-6c27-11e9-8c9f-e2e0d4e95b95.png)

Clique no dropdown  **Criar credenciais**  e escolha  **ID do Cliente OAuth**:  [![image](https://user-images.githubusercontent.com/34013325/57035299-1054df00-6c28-11e9-9a04-a4cef439e41e.png)](https://user-images.githubusercontent.com/34013325/57035299-1054df00-6c28-11e9-9a04-a4cef439e41e.png)

Aqui não tem muito segredo, escolha  **Aplicativo da Web**  para o  **Tipo de Aplicativo**, escolha um  **nome do aplicativo**, no primeiro campo insira o endereço  **[http://localhost:5000](http://localhost:5000/)**  e no segundo  **[http://localhost:5000/oauth2callback](http://localhost:5000/oauth2callback)**  e clique no botão criar:

[![image](https://user-images.githubusercontent.com/34013325/57035477-85281900-6c28-11e9-829a-1c0c074bc478.png)](https://user-images.githubusercontent.com/34013325/57035477-85281900-6c28-11e9-829a-1c0c074bc478.png)

Após ser criada, irá aparecer uma janela com as credenciais, você pode dar ok, pois iremos baixar as credencias como na tela abaixo:

[![image](https://user-images.githubusercontent.com/34013325/57036076-aa695700-6c29-11e9-8c4d-fc78fecdae46.png)](https://user-images.githubusercontent.com/34013325/57036076-aa695700-6c29-11e9-8c4d-fc78fecdae46.png)

renomeio o arquivo para  **google-youtube.json**  e salve dentro da pasta  **video-maker/credentials**  😄

## [](https://github.com/filipedeschamps/video-maker/blob/master/README.md#1-2-3-testando)1.., 2..., 3... Testando!

Agora dentro da pasta  **video-maker**  você pode abrir o  **cmd**  ou  **powershell**  e executar o comando:

```
node index.js

```

[![ezgif-5-a906cfcd3fd1](https://user-images.githubusercontent.com/34013325/57246263-33f69b80-7013-11e9-97a1-2f84acf2a7fe.gif)](https://user-images.githubusercontent.com/34013325/57246263-33f69b80-7013-11e9-97a1-2f84acf2a7fe.gif)
