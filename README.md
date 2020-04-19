# GEOMAP
Georreferenciamento para distribuição de impressões 3d voluntárias para unidades de saúde.

## Descrição
O GEOMAP é uma implementação básica da API do Google Maps que permite a v

## Dependências:
* Node.js versão 8.0 ou superior
* git

## Instruções:
1. Faça o clone do projeto para a pasta desejada
2. Entre com o comando "npm install" para instalar os pacotes necessários
3. Insira sua chave de API do Google Maps no arquivo index.html
4. Obtenha as credenciais da API do google sheets e coloque os arquivos **credentials.json** e **token.json** na pasta principal do projeto. Em caso de dúvidas sobre como obter as credenciais da API do sheets, acesse o link a seguir e siga rigorosamente as instruções:
https://developers.google.com/sheets/api/quickstart/nodejs?hl=pt-br
5. Rode o script na pasta do projeto entrando com o comando "npm start" ou "node app"

OBS: É necessário ter autorização de acesso às planilhas que serão utilizadas como base de dados

## Agradecimentos

A todos os makers e voluntários que dedicaram seus recursos, equipamento, e tempo para promover a seguraça de quem cuida de nós: os profissioais de saúde, e porque não, agradecer aos próprios profissionais de saúde.
Fica um agradecimento especial ao time de logística do SOS3D Covid-19, a saber:
* Alexander Ishikawa
* Bárbara Castro
* Caroline Contador
* Daniel Wittic
* Danielle Cohen
* Franklin Véras
* João Danilo
* Jonathas Kerber
* Lidiane Lima
* Luiz Ludwig
* Milena Peclat

## Exemplos de aplicação
### Dashboard + Marcadores personalizados
![Exemplo de mapa](/readme/mapa_2.JPG)
### Mapa + KML
![Exemplo de mapa](/readme/mapa.jpg)
