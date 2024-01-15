# Changelog

## [Não publicado]

## [0.14.8] / 2024-01-15

### Segurança

- Atualizado as dependências npm

## [0.14.7] / 2023-10-30

### Segurança

- Atualizado as dependências npm

## [0.14.6] / 2023-09-19

### Segurança

- Atualizado as dependências npm

## [0.14.5] / 2023-07-28

### Corrigido

- Arquivo `.pfx` com lista de certificados invertida

## [0.14.4] / 2023-07-19

### Modificado

- Atualizado README.md

### Segurança

- Atualizado as dependências npm

## [0.14.3] / 2023-06-08

### Segurança

- Atualizado as dependências npm

## [0.14.2] / 2023-04-17

### Segurança

- Atualizado as dependências npm

## [0.14.1] / 2023-02-21

### Segurança

- Atualizado as dependências npm

## [0.14.0] / 2023-01-14

### Adicionado

- Testes Unitários #8

### Modificado

- Estruturação do código para ser possível testar cada módulo separadamente

### Segurança

- Atualizado as dependências npm

## [0.13.0] / 2022-11-29

### Modificado

- Biblioteca para lidar com datas e horas #7

## [0.12.0] / 2022-11-24

### Corrigido

- Método `consultaNSU` #4

### Segurança

- Atualizado as dependências npm

## [0.11.0] / 2022-08-20

### Adicionado

- Suporte para CPF nos serviços de `DistribuicaoDFe` e `RecepcaoEvento` #2
- Suporte para o tipo Buffer nas propriedades `cert` e `key` #3

### Corrigido

- Types

## [0.10.1] / 2022-08-15

### Adicionado

- ISSUE_TEMPLATE
- CODE_OF_CONDUCT.md
- CONTRIBUTING.md

### Corrigido

- Imutabilidade
- Types

### Modificado

- .npmignore

## [0.10.0] / 2022-08-11

### Adicionado

- Imutabilidade aos serviços de `DistribuicaoDFe` e `RecepcaoEvento`

### Corrigido

- Types

### Modificado

- Os métodos `consultaUltNSU`, `consultaChNFe`, `consultaNSU` e `enviarEvento` agora são funções puras e não alteram mais o objeto construído

## [0.9.2] / 2022-06-24

### Corrigido

- Types

## [0.9.1] / 2022-06-21

### Corrigido

- Campos faltantes no retorno do serviço de RecepcaoEvento
- Types

## [0.9.0] / 2022-06-21

### Corrigido

- Assinatura XML
- Types

### Modificado

- O retorno dos serviços de DistribuicaoDFe e RecepcaoEvento

## [0.8.0] / 2022-06-14

### Adicionado

- VS Code settings e prettier.config.js

### Corrigido

- Types
- Palavra-chave

### Modificado

- O serviço de RecepcaoEvento foi modificado para aceitar um lote de eventos, agora deve ser enviado uma lista de eventos para a função enviarEvento, e o retorno será uma lista dos eventos processados

## [0.7.3] / 2022-06-10

### Corrigido

- Montagem do Esquema XML de RecepcaoEvento

## [0.7.2] / 2022-06-10

### Corrigido

- Script para build do código

### Modificado

- A chave NFe não é mais passada no construtor do serviço de RecepcaoEvento, agora ela deve ser enviada na função de enviarEvento junto com o tipoEvento e justificativa
- URL do Web Service de Recepção Evento do Ambiente de produção

## [0.7.1] / 2022-06-09

### Modificado

- Simplificado o nome das funções de consulta do serviço de DistribuicaoDFe
  - consultaPorUltNSU => consultaUltNSU
  - consultaPorChaveNFe => consultaChNFe
  - consultaPorNSU => consultaNSU

### Segurança

- Atualizado as dependências npm

## [0.7.0] / 2022-06-09

### Adicionado

- Cadeia de Certificados da NF-e (www1.nfe.fazenda.gov.br)
- Suporte SOAP 1.2

### Corrigido

- Script para build do código

### Modificado

- URL do Web Service de Recepção Evento do Ambiente de homologação conforme publicado no informe dia 20/05/2022

### Removido

- Suporte SOAP 1.1

## [0.6.0] / 2022-04-28

### Modificado

- Biblioteca para geração de XML

## [0.5.0] / 2022-04-28

### Corrigido

- Script para build do código
- Retorno da Sefaz
- Types

### Modificado

- Consulta por último NSU

## [0.4.1] / 2022-04-25

### Corrigido

- Types

## [0.4.0] / 2022-04-25

### Adicionado

- Script para minificação do código
- Script para build do código (Gera os types e o código minificado)
- .npmignore

### Corrigido

- Palavra-chave

### Removido

- Types do repositório Git
- src do repositório NPM
- tsconfig.json do repositório NPM

## [0.3.0] / 2022-04-22

### Adicionado

- Descrição e Palavra-chave
- README.md Resumido

## [0.2.2] / 2022-04-22

### Corrigido

- Types

## [0.2.1] / 2022-04-22

### Corrigido

- Types

## [0.2.0] / 2022-04-22

### Adicionado

- Types

### Corrigido

- Otimizado código de comunicação com o Web Service

## [0.1.0] / 2022-04-20

### Adicionado

- Comunicação com o Web Service de NFeDistribuicaoDFe (Nota Técnica 2014.002 - v.1.12)
  - Processamento da Requisição de Distribuição de Conjunto de DF-e a Partir do NSU Informado (distNSU)
  - Processamento da Requisição de Consulta DF-e Vinculado ao NSU Informado (consNSU)
  - Processamento da Requisição de Consulta de NF-e por Chave de Acesso Informada (consChNFe)
- Comunicação com o Web Service de NFeRecepcaoEvento4 (Nota Técnica 2020.001 v.1.20)
  - 210200 - Confirmação da Operação
  - 210210 - Ciência da Operação
  - 210220 - Desconhecimento da Operação
  - 210240 - Operação não Realizada

[não publicado]: https://github.com/lucashpmelo/node-mde/compare/0.14.8..HEAD
[0.14.8]: https://github.com/lucashpmelo/node-mde/compare/0.14.7...0.14.8
[0.14.7]: https://github.com/lucashpmelo/node-mde/compare/0.14.6...0.14.7
[0.14.6]: https://github.com/lucashpmelo/node-mde/compare/0.14.5...0.14.6
[0.14.5]: https://github.com/lucashpmelo/node-mde/compare/0.14.4...0.14.5
[0.14.4]: https://github.com/lucashpmelo/node-mde/compare/0.14.3...0.14.4
[0.14.3]: https://github.com/lucashpmelo/node-mde/compare/0.14.2...0.14.3
[0.14.2]: https://github.com/lucashpmelo/node-mde/compare/0.14.1...0.14.2
[0.14.1]: https://github.com/lucashpmelo/node-mde/compare/0.14.0...0.14.1
[0.14.0]: https://github.com/lucashpmelo/node-mde/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/lucashpmelo/node-mde/compare/0.12.0...0.13.0
[0.12.0]: https://github.com/lucashpmelo/node-mde/compare/0.11.0...0.12.0
[0.11.0]: https://github.com/lucashpmelo/node-mde/compare/0.10.1...0.11.0
[0.10.1]: https://github.com/lucashpmelo/node-mde/compare/0.10.0...0.10.1
[0.10.0]: https://github.com/lucashpmelo/node-mde/compare/0.9.2...0.10.0
[0.9.2]: https://github.com/lucashpmelo/node-mde/compare/0.9.1...0.9.2
[0.9.1]: https://github.com/lucashpmelo/node-mde/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/lucashpmelo/node-mde/compare/0.8.0...0.9.0
[0.8.0]: https://github.com/lucashpmelo/node-mde/compare/0.7.3...0.8.0
[0.7.3]: https://github.com/lucashpmelo/node-mde/compare/0.7.2...0.7.3
[0.7.2]: https://github.com/lucashpmelo/node-mde/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/lucashpmelo/node-mde/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/lucashpmelo/node-mde/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/lucashpmelo/node-mde/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/lucashpmelo/node-mde/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/lucashpmelo/node-mde/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/lucashpmelo/node-mde/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/lucashpmelo/node-mde/compare/0.2.2...0.3.0
[0.2.2]: https://github.com/lucashpmelo/node-mde/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/lucashpmelo/node-mde/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/lucashpmelo/node-mde/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/lucashpmelo/node-mde/releases/tag/0.1.0
