const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") 
       creditos += Math.floor(apre.audiencia / 5);
    return creditos; }

  calcularTotalCreditos(pecas, apre) {
    return apre.reduce((total, ap) => {return total + this.calcularCredito(pecas, ap); }, 0); }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    const peca = getPeca(pecas, apre);
    
    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30); }
          break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20); }
        total += 300 * apre.audiencia;
        break;
      default:        
        throw new Error(`Peça desconhecia: ${peca.tipo}`); }      
              
    return total; }  

  calcularTotalFatura(pecas, apre) {
    return apre.reduce((total, ap) => {return total + this.calcularTotalApresentacao(pecas, ap); }, 0); }

}


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
     { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100); }


function getPeca(pecas, apre) {
  return pecas[apre.id]; }


function gerarFaturaStr (fatura, pecas) {

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr; }

// function gerarFaturaHTML(fatura, pecas) {
//   let resultado = `<html>\n`;
//   resultado += `<p> Fatura ${fatura.cliente} </p>\n`;
//   resultado += `<ul>\n`;
  
//   for (let apre of fatura.apresentacoes) {
//     const peca = getPeca(pecas, apre);
//     const total = calcularTotalApresentacao(pecas, apre);
//     resultado += `<li>  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
//   }
  
//   const totalFatura = calcularTotalFatura(pecas, fatura.apresentacoes);
//   const creditos = calcularTotalCreditos(pecas, fatura.apresentacoes);
  
//   resultado += `</ul>\n`;
//   resultado += `<p> Valor total: ${formatarMoeda(totalFatura)} </p>\n`;
//   resultado += `<p> Créditos acumulados: ${creditos} </p>\n`;
//   resultado += `</html>`;
  
//   return resultado; }


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);

console.log(faturaStr);

//const faturaHTML = gerarFaturaHTML(faturas, pecas);
//console.log(faturaHTML);
