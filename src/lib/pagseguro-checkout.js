const request = require('request');
const xmlParser = require('xml2json');

const pagseguro = function(params) {
  /**
   * MODO DE PRODUÇÃO: {
   * email: email de produção
   * token: token de produção
   * }
   * MODO SANDBOX: {
   * email: email sandbox, 
   * token: token sandbox, 
   * sandbox: true, 
   * sandbox_email: email sandbox
   * }
   */
  this.email = params.email;
  this.token = params.token;
  this.mode = params.sandbox == true ? 'sandbox' : 'prod';
  this.currency = params.currency || 'BRL';
  this.sandbox_email = params.sandbox_email;

  switch (this.mode) {
      case 'prod': this.url = 'https://ws.pagseguro.uol.com.br/v2'; break;
      case 'sandbox': this.url = 'https://ws.sandbox.pagseguro.uol.com.br/v2'; break;
  }

  // usa os dados de acordo com o que foi definido (produção ou sandbox)
  this.checkoutData = {
      email: this.email,
      token: this.token,
      mode: this.mode,
      currency: this.currency,
      url: this.url
  }

  this.items = [];
}

/**
 * função que envia os dados da compra e retorna o ID da sessão
 * para poder ir pra página de redirecionamento.
 * Para consultar os campos a serem enviados acessem: https://dev.pagseguro.uol.com.br/reference/checkout-pagseguro#checkout-pagseguro-criacao-checkout-pagseguro
 * 
 */

pagseguro.prototype.sessionId = function(checkout, cb) {  
  // moeda padrão BRL
  this.checkoutData.currency = this.currency;
  // dados referente ao item do pagamento
  this.checkoutData.itemId1 = checkout.itemId1; //Descrições dos itens.
  this.checkoutData.itemDescription1 = checkout.itemDescription1;
  this.checkoutData.itemAmount1 = checkout.itemAmount1; //Valores unitários dos itens
  this.checkoutData.itemQuantity1 = checkout.itemQuantity1; //Quantidades dos itens.
  this.checkoutData.itemWeight1 = checkout.itemWeight1; //Pesos dos itens. Correspondem ao peso (em gramas) de cada item sendo pago
  this.checkoutData.reference = checkout.reference; //Código de referência. Define um código para fazer referência ao pagamento.
  // dados referente ao comprador
  this.checkoutData.senderName = checkout.senderName;
  this.checkoutData.senderAreaCode = checkout.senderAreaCode;
  this.checkoutData.senderPhone = checkout.senderPhone;
  this.checkoutData.senderCPF = checkout.senderCPF;
  this.checkoutData.senderBornDate = checkout.senderBornDate;
  this.checkoutData.senderEmail = checkout.senderEmail;
  // dados extras da compra
  this.checkoutData.extraAmount = checkout.extraAmount; //Especifica um valor extra que deve ser adicionado ou subtraído ao valor total do pagamento
  this.checkoutData.maxUses = checkout.maxUses; //Número máximo de usos para o código de pagamento.
  this.checkoutData.maxAge = checkout.maxAge; //Prazo de validade do código de pagamento

  const params = {
    url: `${this.url}/checkout?token=${this.token}&email=${this.email}`,
    form:  this.checkoutData
  }
  
  request.post(params, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.checkout);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })
}

/**
 * função que retorna todas as transações de determinada referência da compra*
 * 
 */
pagseguro.prototype.getTransactions = function(transactionSearchResult, cb) {

  // Código de referência da transação.
  const reference = `&reference=${transactionSearchResult.reference}`;

  // data no formato YYYY-MM-DDThh:mm:ss.sTZD. Esta data não pode ser anterior a 6 meses da data corrente.
  const initialDate = `&initialDate=${transactionSearchResult.initialDate}`;

  // Esta data não pode ser anterior a 6 meses da data corrente. Se estiver utilizando o initialDate
  const finalDate = `&finalDate=${transactionSearchResult.finalDate}`;

  // especifica qual é a página de resultados a ser retornada.
  const page = `&page=${transactionSearchResult.page}`;
  
  //  limitar o tamanho da resposta de cada chamada à consulta
  const maxPageResults = `&maxPageResults=${transactionSearchResult.maxPageResults}`;

  const url = `${this.url}/transactions?token=${this.token}&email=${this.email}${reference}`
  
  request.get({url: url}, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.transactionSearchResult);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })

}

/**
 * função que retorna os detalhes de determinada transação
 */

pagseguro.prototype.getDetailsTransaction = function(transaction, cb) {

  const credentials = `?email=${this.email}&token=${this.token}`;
  const url = `https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/${transaction}${credentials}`

  request.get({url: url}, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.transaction);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })
}

/**
 * função para estornar total da transação
 */

pagseguro.prototype.totalRefundTransaction = function(result, cb) {
  const transactionCode = `&transactionCode=${result.transactionCode}`;

  const url = `${this.url}/transactions/refunds?token=${this.token}&email=${this.email}${transactionCode}`
  //return console.log(url)
  request.post({url: url}, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.result);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })
}

/**
 * função para estornar parcialmente a transação
 * deve-se indicar o valor do campo refundValue
 */

pagseguro.prototype.partialRefundTransaction = function(result, cb) {
  const transactionCode = `&transactionCode=${result.transactionCode}`;
  const refundValue = `&refundValue=${result.refundValue}`;

  const url = `${this.url}/transactions/refunds?token=${this.token}&email=${this.email}${transactionCode}${refundValue}`
  
  request.post({url: url}, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.result);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })
}

/**
 * função para cancelar a transação
 */

pagseguro.prototype.cancelTransaction = function(result, cb) {
  const transactionCode = `&transactionCode=${result.transactionCode}`;

  const url = `${this.url}/transactions/cancels?token=${this.token}&email=${this.email}${transactionCode}`

  request.post({url: url}, function(err, response, body) {
    if (err) {
      return cb(err, false);
    } else if (response.statusCode == 200) {
      const json = JSON.parse(xmlParser.toJson(body));
      return cb(false, json.result);
    } else {
      const json = JSON.parse(xmlParser.toJson(body));
      if (json.errors && json.errors.error) {
          return cb(json.errors.error, false);
      }

      return cb(body, false);
    }
  })
}



module.exports = pagseguro;