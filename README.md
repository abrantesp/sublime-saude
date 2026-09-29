# Sublime Saúde

## Sobre o projeto

O Sublime Saúde é um projeto escolar de desenvolvimento web, criado por estudantes do segundo ano do ensino médio integrado ao curso técnico em TI. A proposta é estudar como uma interface digital pode organizar informações e demonstrar um caminho acessível para encontrar serviços de saúde.

O site é um protótipo educativo, não uma plataforma de atendimento. As especialidades, unidades, datas e horários são exemplos. O formulário apresenta uma confirmação apenas na tela: não envia dados, não reserva consultas e não substitui orientação de profissionais de saúde.

## Autores

- Ana Quézia Costa de Araújo
- Pamela Patrícia Araújo Ciríaco da Cruz
- Lorena Camille Câmara Silva
- Maria Eduarda Abrantes Pereira
- Rwan Mathews Souza Ferreira da Silva

## Páginas

- `index.html`: início e apresentação do projeto.
- `especialidades.html`: lista demonstrativa de áreas de atendimento.
- `como-funciona.html`: etapas do fluxo e explicação dos recursos de acessibilidade.
- `sobre-nos.html`: objetivo escolar, escopo e limites do protótipo.
- `agendar-consulta.html`: formulário local para simular as escolhas de um agendamento.

## Tecnologias e estrutura

O projeto usa somente HTML, CSS e JavaScript, sem bibliotecas ou serviços externos.

```text
.
|-- index.html
|-- especialidades.html
|-- como-funciona.html
|-- sobre-nos.html
|-- agendar-consulta.html
|-- assets/
|   |-- css/style.css
|   `-- js/app.js
|-- README.md
`-- Termo de Abertura.pdf
```

O CSS compartilhado concentra cores, componentes e regras responsivas. O JavaScript compartilhado controla o menu para celular, os recursos de acessibilidade e a validação do formulário.

## Como executar

Abra `index.html` em um navegador moderno. Para uma experiência mais previsível, abra a pasta no VS Code e use a extensão Live Server para servir o site localmente. Não há instalação de dependências nem etapa de compilação.

## Acessibilidade

- Link para pular diretamente ao conteúdo principal.
- Navegação por teclado, indicador de foco e menu responsivo com estado anunciado.
- Leitura em voz alta do conteúdo principal pela API de síntese de fala do navegador, quando disponível.
- Controles para ampliar o texto e ativar alto contraste.
- Formulários com rótulos, validação nativa e retorno textual anunciado para tecnologias assistivas.
- Informações importantes apresentadas em texto, sem depender apenas de áudio.

A leitura em voz alta complementa, mas não substitui, leitores de tela. Pessoas surdas ou com deficiência auditiva recebem instruções e confirmações visuais em texto; o protótipo não possui conteúdo de áudio ou vídeo que exija legendas.

## Limites e próximos passos

Não há servidor, cadastro, banco de dados, autenticação ou envio de informações. O protótipo não deve receber dados pessoais ou dados de saúde. Uma futura integração real precisaria de validação com os serviços de saúde envolvidos, segurança, controle de acesso e tratamento adequado de dados pessoais.