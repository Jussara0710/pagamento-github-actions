# Serviço de Pagamento

Classe `ServicoDePagamento` com testes Mocha usando Page Objects.

## Estrutura

```
projeto-pagamento/
├── src/
│   └── ServicoDePagamento.js   # Classe principal
├── pageObjects/
│   └── index.js                # Page Objects
├── test/
│   └── ServicoDePagamento.test.js  # Testes Mocha
├── .mocharc.yml
└── package.json
```

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Rodar os testes
npm test
```

## Exemplo de uso

```js
const ServicoDePagamento = require('./src/ServicoDePagamento');

const servico = new ServicoDePagamento();

servico.pagar('0987-7656-3475', 'Samar', 156.87);

console.log(servico.consultarUltimoPagamento());
// { codigoBarras: '0987-7656-3475', empresa: 'Samar', valor: 156.87, categoria: 'cara' }
```
"# pagamento-github-actions" 
