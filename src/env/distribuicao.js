/**
 * URL Serviço NFeDistribuicaoDFe
 * Página Principal > Serviços > Relação de Serviços Web > Ambiente Nacional - (AN)
 */
const DISTRIBUICAONFE = {
  1: 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl',
  2: 'https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl',
  // https://hom.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl
}
const DISTRIBUICAOCTE = {
  1: 'https://www1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx?wsdl',
  2: 'https://hom1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx?wsdl',
}

module.exports = { DISTRIBUICAONFE, DISTRIBUICAOCTE }
