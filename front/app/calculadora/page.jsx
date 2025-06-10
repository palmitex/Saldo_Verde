'use client';

import { useState, useEffect } from 'react';
import './calculadora.css';

export default function Calculadora() {
  const [valores, setValores] = useState({
    depositoInicial: '',
    depositoMensal: '',
    periodo: '',
    taxaJuros: '',
    usarTaxaAutomatica: true
  });

  const [resultado, setResultado] = useState({
    total: 0,
    juros: 0,
    depositoTotal: 0,
  });

  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [detalhesAnuais, setDetalhesAnuais] = useState([]);
  const [taxaSelic, setTaxaSelic] = useState(null);

  // Buscar taxa Selic atual
  useEffect(() => {
    const buscarTaxaSelic = async () => {
      try {
        // Taxa Selic atual (13.75% - atualizar conforme necessário)
        const taxaAtual = 13.75;
        // Taxa de rendimento da poupança (70% da Selic quando Selic > 8.5%)
        const taxaPoupanca = taxaAtual > 8.5 ? taxaAtual * 0.7 : 0.7 * 8.5;
        setTaxaSelic(taxaPoupanca);
        if (valores.usarTaxaAutomatica) {
          setValores(prev => ({
            ...prev,
            taxaJuros: taxaPoupanca.toFixed(2)
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar taxa Selic:', error);
      }
    };

    buscarTaxaSelic();
  }, [valores.usarTaxaAutomatica]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'usarTaxaAutomatica') {
      const checked = e.target.checked;
      setValores(prev => ({
        ...prev,
        usarTaxaAutomatica: checked,
        taxaJuros: checked ? taxaSelic?.toFixed(2) || '' : ''
      }));
    } else {
      // Remove caracteres não numéricos, exceto ponto decimal
      const numeroLimpo = value.replace(/[^\d.]/g, '');
      
      setValores(prev => ({
        ...prev,
        [name]: numeroLimpo
      }));
    }
  };

  const calcularPoupanca = () => {
    const depositoInicial = parseFloat(valores.depositoInicial) || 0;
    const depositoMensal = parseFloat(valores.depositoMensal) || 0;
    const periodo = parseInt(valores.periodo) || 0;
    const taxaJuros = parseFloat(valores.taxaJuros) || 0;
    
    const taxaMensal = taxaJuros / 12 / 100;
    let saldoAtual = depositoInicial;
    let detalhes = [];
    
    // Para cada ano
    for (let ano = 1; ano <= Math.ceil(periodo / 12); ano++) {
      let saldoInicioAno = saldoAtual;
      let mesesNoAno = ano === Math.ceil(periodo / 12) ? periodo % 12 || 12 : 12;
      
      // Para cada mês do ano
      for (let mes = 1; mes <= mesesNoAno; mes++) {
        // Adiciona o depósito mensal
        saldoAtual += depositoMensal;
        // Aplica os juros mensais
        saldoAtual *= (1 + taxaMensal);
      }
      
      detalhes.push({
        ano,
        saldoInicial: saldoInicioAno,
        saldoFinal: saldoAtual,
        rendimento: saldoAtual - saldoInicioAno - (depositoMensal * mesesNoAno)
      });
    }

    const depositoTotal = depositoInicial + (depositoMensal * periodo);
    const total = saldoAtual;
    const juros = total - depositoTotal;

    setResultado({
      total,
      juros,
      depositoTotal
    });

    setDetalhesAnuais(detalhes);
  };

  return (
    <div className="calculadora-container">
      <div className="calculadora-card">
        <h1 className="calculadora-titulo">Calculadora de Poupança</h1>
        <p className="calculadora-descricao">
          Calcule quanto suas economias podem render ao longo do tempo com depósitos regulares.
        </p>

        <div className="input-group">
          <label>
            Depósito Inicial
            <input
              type="text"
              name="depositoInicial"
              value={valores.depositoInicial}
              onChange={handleInputChange}
              placeholder="R$ 0,00"
              className="calculadora-input"
            />
          </label>

          <label>
            Depósito Mensal
            <input
              type="text"
              name="depositoMensal"
              value={valores.depositoMensal}
              onChange={handleInputChange}
              placeholder="R$ 0,00"
              className="calculadora-input"
            />
          </label>

          <label>
            Período (meses)
            <input
              type="text"
              name="periodo"
              value={valores.periodo}
              onChange={handleInputChange}
              placeholder="0"
              className="calculadora-input"
            />
          </label>

          <div className="taxa-juros-container">
            <label className="taxa-checkbox">
              <input
                type="checkbox"
                name="usarTaxaAutomatica"
                checked={valores.usarTaxaAutomatica}
                onChange={handleInputChange}
                className="taxa-checkbox-input"
              />
              <span className="taxa-checkbox-text">Usar taxa atual da poupança</span>
            </label>

            <label>
              Taxa de Juros Anual (%)
              <input
                type="text"
                name="taxaJuros"
                value={valores.taxaJuros}
                onChange={handleInputChange}
                placeholder="0.00"
                className="calculadora-input"
                disabled={valores.usarTaxaAutomatica}
              />
              {valores.usarTaxaAutomatica && taxaSelic && (
                <span className="taxa-info">
                  Taxa atual: {taxaSelic.toFixed(2)}% a.a. (70% da Selic)
                </span>
              )}
            </label>
          </div>
        </div>

        <button onClick={calcularPoupanca} className="calculadora-botao">
          Calcular
        </button>

        {resultado.total > 0 && (
          <div className="resultado-container">
            <div className="resultado-card">
              <h3>Valor Total Final</h3>
              <p className="valor-destaque">{formatarMoeda(resultado.total)}</p>
            </div>

            <div className="resultado-detalhes">
              <div className="detalhe-item">
                <span>Total Investido</span>
                <span>{formatarMoeda(resultado.depositoTotal)}</span>
              </div>
              <div className="detalhe-item">
                <span>Juros Ganhos</span>
                <span>{formatarMoeda(resultado.juros)}</span>
              </div>
            </div>

            <button
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="botao-detalhes"
            >
              {mostrarDetalhes ? 'Ocultar Detalhes' : 'Ver Detalhes Anuais'}
            </button>

            {mostrarDetalhes && (
              <div className="tabela-detalhes">
                <table>
                  <thead>
                    <tr>
                      <th>Ano</th>
                      <th>Saldo Inicial</th>
                      <th>Saldo Final</th>
                      <th>Rendimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalhesAnuais.map((detalhe) => (
                      <tr key={detalhe.ano}>
                        <td>{detalhe.ano}º</td>
                        <td>{formatarMoeda(detalhe.saldoInicial)}</td>
                        <td>{formatarMoeda(detalhe.saldoFinal)}</td>
                        <td>{formatarMoeda(detalhe.rendimento)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="dicas-container">
          <h3>Dicas de Investimento</h3>
          <ul>
            <li>Comece cedo: quanto mais tempo investir, mais seus juros compostos trabalharão a seu favor.</li>
            <li>Seja consistente: depósitos regulares, mesmo que pequenos, fazem grande diferença no longo prazo.</li>
            <li>Diversifique: além da poupança, considere outros investimentos com potencial de retorno maior.</li>
            <li>Mantenha uma reserva de emergência equivalente a 3-6 meses de despesas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 