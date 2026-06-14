const assert = require('assert');
const ServicoDePagamento = require('../src/ServicoDePagamento');
const {
  PaginaDeServico,
  PaginaDePagamento,
  PaginaDeConsulta,
  PaginaDeCategorias,
} = require('../pageObjects');

describe('ServicoDePagamento', () => {

  // ─── Cenário 1: lista vazia ───────────────────────────────────
  describe('consultarUltimoPagamento — lista vazia', () => {
    let paginaConsulta;

    beforeEach(() => {
      const { servico } = new PaginaDeServico();
      paginaConsulta = new PaginaDeConsulta(servico);
    });

    it('deve retornar null quando não há pagamentos', () => {
      paginaConsulta.verificarListaVazia();
    });
  });

  // ─── Cenário 2: pagamento acima de R$ 100 ─────────────────────
  describe('pagar — valor acima de R$ 100 (categoria "cara")', () => {
    let pagamento;
    let paginaPagamento;
    let paginaConsulta;

    beforeEach(() => {
      const paginaServico = new PaginaDeServico();
      const servico = paginaServico.obterServico();
      paginaPagamento = new PaginaDePagamento(servico);
      paginaConsulta  = new PaginaDeConsulta(servico);
      pagamento = paginaPagamento.realizarPagamento('0987-7656-3475', 'Samar', 156.87);
    });

    it('deve retornar um objeto com as propriedades corretas', () => {
      paginaPagamento.verificarPropriedades(pagamento, '0987-7656-3475', 'Samar', 156.87);
    });

    it('deve atribuir categoria "cara" para valor > 100', () => {
      paginaPagamento.verificarCategoria(pagamento);
      assert.strictEqual(pagamento.categoria, 'cara');
    });

    it('consultarUltimoPagamento deve retornar o pagamento realizado', () => {
      paginaConsulta.verificarUltimoPagamento({
        codigoBarras: '0987-7656-3475',
        empresa:      'Samar',
        valor:        156.87,
        categoria:    'cara',
      });
    });
  });

  // ─── Cenário 3: pagamento abaixo de R$ 100 ────────────────────
  describe('pagar — valor abaixo de R$ 100 (categoria "padrão")', () => {
    let pagamento;
    let paginaPagamento;
    let paginaConsulta;

    beforeEach(() => {
      const paginaServico = new PaginaDeServico();
      const servico = paginaServico.obterServico();
      paginaPagamento = new PaginaDePagamento(servico);
      paginaConsulta  = new PaginaDeConsulta(servico);
      pagamento = paginaPagamento.realizarPagamento('1234-5678-9000', 'LojaABC', 49.90);
    });

    it('deve retornar um objeto com as propriedades corretas', () => {
      paginaPagamento.verificarPropriedades(pagamento, '1234-5678-9000', 'LojaABC', 49.90);
    });

    it('deve atribuir categoria "padrão" para valor <= 100', () => {
      paginaPagamento.verificarCategoria(pagamento);
      assert.strictEqual(pagamento.categoria, 'padrão');
    });

    it('consultarUltimoPagamento deve retornar apenas o último pagamento', () => {
      paginaConsulta.verificarUltimoPagamento({
        codigoBarras: '1234-5678-9000',
        empresa:      'LojaABC',
        valor:        49.90,
        categoria:    'padrão',
      });
    });
  });

  // ─── Cenário 4: múltiplos pagamentos — último sempre vence ────
  describe('consultarUltimoPagamento — múltiplos pagamentos', () => {
    let paginaPagamento;
    let paginaConsulta;

    beforeEach(() => {
      const servico = new PaginaDeServico().obterServico();
      paginaPagamento = new PaginaDePagamento(servico);
      paginaConsulta  = new PaginaDeConsulta(servico);

      paginaPagamento.realizarPagamento('0001-0001-0001', 'Empresa1', 200);
      paginaPagamento.realizarPagamento('0002-0002-0002', 'Empresa2', 30);
    });

    it('deve retornar apenas o último pagamento inserido', () => {
      paginaConsulta.verificarUltimoPagamento({
        codigoBarras: '0002-0002-0002',
        empresa:      'Empresa2',
        valor:        30,
        categoria:    'padrão',
      });
    });

    it('não deve retornar o primeiro pagamento como último', () => {
      const ultimo = paginaConsulta.obterUltimoPagamento();
      assert.notStrictEqual(ultimo.codigoBarras, '0001-0001-0001');
    });
  });

  // ─── Cenário 5: validações de categoria e fronteira ───────────
  describe('categoria — regras de negócio', () => {
    let paginaCategorias;

    beforeEach(() => {
      const servico = new PaginaDeServico().obterServico();
      paginaCategorias = new PaginaDeCategorias(servico);
    });

    it('valor 150 deve ser "cara"', () => {
      paginaCategorias.validarCategoriaCara('1111-1111-1111', 'EmpresaX', 150);
    });

    it('valor 50 deve ser "padrão"', () => {
      paginaCategorias.validarCategoriaPadrao('2222-2222-2222', 'EmpresaY', 50);
    });

    it('valor exato 100 (fronteira) deve ser "padrão"', () => {
      paginaCategorias.validarFronteira('3333-3333-3333', 'EmpresaZ', 100);
    });

    it('valor 100.01 deve ser "cara"', () => {
      const servico = new ServicoDePagamento();
      const p = servico.pagar('4444-4444-4444', 'EmpresaW', 100.01);
      assert.strictEqual(p.categoria, 'cara');
    });
  });

});
