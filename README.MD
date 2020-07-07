<h2 align="center">
<p align="center"> Integração PagSeguro UOL com checkout redirect para NodeJs</p>
</h2>

## Como usar
### Modo Produção
```
const PagSeguro = require('node-pagseguro');

const payment = new PagSeguro({
   email: 'seuemail@email.com',
   token: 'seutokenproducao',
   currency: '' //opcional - default BRL
});
```
### Modo Sandbox
```
const  payment = new PagSeguro({
   email: 'seuemail@email.com',
   token: 'seutokensandbox',
   sandbox: true,
   sandbox_email: 'seuemai@sandbox.pagseguro.com.br'
})
```
### Criando Sessão - POST
```
   payment.sessionId({
/*
* Para consultar os campos a serem enviados acessem: https://dev.pagseguro.uol.com.br/reference/checkout-pagseguro#checkout-pagseguro-criacao-checkout-pagseguro
*/
    currency: 'padrão BRL',
    itemId1: 'id do item',
    itemDescription1: 'descrição do item',
    itemAmount1: 'valor unitário do item',
    itemQuantity1: 'quantidade de cada item',
    itemWeight1: 'peso do item',

   },function(err, sesson_id){
     if(err) {
       return console.log(err)
     }
     return console.log(sesson_id)
   })
```
### Link de redirecionamento - GET
```
 const linkRedirect = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=codigoobtidonopassoum`;

  return console.log(linkRedirect);
```
### Consultar transações - GET
```
  payment.getTransactions({
    reference: 'codigo de referencia da compra', //obrigatório
    inicialDate: 'data inicial a ser filtrada',
    finalDate: 'data final a ser filtrada',
    page: 'página da consulta',
    maxPageResults: 'quantidade máxima de resultados a ser retornado'

  },function(err, transactions){
    if(err) {
      return console.log(err)
    }
    return console.log(transactions)
  })
```
### Consultar detalhe da transação - GET
```
  payment.getDetailsTransaction('codigo_da_transacao', function(err, detailsTransaction) {
    if(err) {
      return console.log(err)
    }
    return console.log(detailsTransaction)
  })
```

### Estornar transação parcialmente - POST
```
  payment.partialRefundTransaction({
    transactionCode: 'codigo da transacao',
    refundValue: 'valor a ser estornado'

  }, function(err, result) {
    if(err) {
      return console.log(err)
    }
    return console.log(result)
  })
```
### Estornar transação totalmente - POST
```
  payment.partialRefundTransaction({
    transactionCode: 'codigo da transacao'

  }, function(err, result) {
    if(err) {
      return console.log(err)
    }
    return console.log(result)
  })
```

### Cancelar transação - POST
```
  payment.cancelTransaction({
    transactionCode: 'codigo da transacao',

  }, function(err, result) {
    if(err) {
      return console.log(err)
    }
    return console.log(result)
  })
```

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
