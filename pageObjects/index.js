const ServicoDePagamento = require('../src/ServicoDePagamento');

class PaginaDeServico {
  constructor() {
    this.servico = new ServicoDePagamento();
  }

  obterServico() {
    return this.servico;
  }
}

class PaginaDePagamento {
  constructor(servico) {
    this.servico = servico;
  }

  realizarPagamento(codigoBarras, empresa, valor) {
    return this.servico.pagar(codigoBarras, empresa, valor);
  }

  verificarPropriedades(pagamento, codigoBarras, empresa, valor) {
    if (!pagamento)
      throw new Error('Pagamento não pode ser nulo.');
    if (pagamento.codigoBarras !== codigoBarras)
      throw new Error(`codigoBarras: esperado "${codigoBarras}", recebido "${pagamento.codigoBarras}"`);
    if (pagamento.empresa !== empresa)
      throw new Error(`empresa: esperada "${empresa}", recebida "${pagamento.empresa}"`);
    if (pagamento.valor !== valor)
      throw new Error(`valor: esperado ${valor}, recebido ${pagamento.valor}`);
    if (!Object.prototype.hasOwnProperty.call(pagamento, 'categoria'))
      throw new Error('Pagamento deve possuir a propriedade "categoria".');
  }

  verificarCategoria(pagamento) {
    const esperada = pagamento.valor > 100 ? 'cara' : 'padrão';
    if (pagamento.categoria !== esperada)
      throw new Error(`categoria: esperada "${esperada}", recebida "${pagamento.categoria}"`);
  }
}

class PaginaDeConsulta {
  constructor(servico) {
    this.servico = servico;
  }

  obterUltimoPagamento() {
    return this.servico.consultarUltimoPagamento();
  }

  verificarListaVazia() {
    const ultimo = this.obterUltimoPagamento();
    if (ultimo !== null)
      throw new Error(`Esperado null, recebido: ${JSON.stringify(ultimo)}`);
  }

  verificarUltimoPagamento(esperado) {
    const ultimo = this.obterUltimoPagamento();
    if (!ultimo) throw new Error('Nenhum pagamento encontrado.');
    for (const campo of ['codigoBarras', 'empresa', 'valor', 'categoria']) {
      if (ultimo[campo] !== esperado[campo])
        throw new Error(`"${campo}": esperado "${esperado[campo]}", recebido "${ultimo[campo]}"`);
    }
  }
}

class PaginaDeCategorias {
  constructor(servico) {
    this.servico = servico;
  }

  validarCategoriaCara(codigoBarras = '1111-1111-1111', empresa = 'EmpresaX', valor = 150) {
    const p = this.servico.pagar(codigoBarras, empresa, valor);
    if (p.categoria !== 'cara')
      throw new Error(`Valor ${valor} deveria ser "cara", recebeu "${p.categoria}"`);
    return p;
  }

  validarCategoriaPadrao(codigoBarras = '2222-2222-2222', empresa = 'EmpresaY', valor = 50) {
    const p = this.servico.pagar(codigoBarras, empresa, valor);
    if (p.categoria !== 'padrão')
      throw new Error(`Valor ${valor} deveria ser "padrão", recebeu "${p.categoria}"`);
    return p;
  }

  validarFronteira(codigoBarras = '3333-3333-3333', empresa = 'EmpresaZ', valor = 100) {
    const p = this.servico.pagar(codigoBarras, empresa, valor);
    if (p.categoria !== 'padrão')
      throw new Error(`Valor ${valor} (fronteira) deveria ser "padrão", recebeu "${p.categoria}"`);
    return p;
  }
}

module.exports = { PaginaDeServico, PaginaDePagamento, PaginaDeConsulta, PaginaDeCategorias };
