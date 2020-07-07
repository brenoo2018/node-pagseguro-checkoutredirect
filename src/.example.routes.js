const express = require('express');
const routes = express.Router();
const PagSeguro = require('./lib/pagseguro-checkout');


/**
 * rota para cancelar a transação
 */

routes.post('/cancel-transaction', (req, res) => {
  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk, 
     token: token_pgbk, 
     sandbox: true,
     sandbox_email: email_pgbk
  })

  payment.cancelTransaction({
    transactionCode: req.query.transactionCode,

  }, function(err, result) {
    if(err) {
      return res.json(err)
    }
    return res.json({result: result})
  })
})

/**
 * rota para estornar a transação totalmente
 */

routes.post('/total-refund-transaction', (req, res) => {

  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk,
     token: token_pgbk, 
     sandbox: true,
     sandbox_email: email_pgbk
  })

  payment.totalRefundTransaction({
    transactionCode: req.query.transactionCode, 
  }, function(err, result) {
    if(err) {
      return res.json(err)
    }
    return res.json({result: result})
  })
})

/**
 * rota para estornar a transação parcialmente
 */

routes.post('/partial-refund-transaction', (req, res) => {

  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk, 
     token: token_pgbk,
     sandbox: true,
     sandbox_email: email_pgbk
  })

  payment.partialRefundTransaction({
    transactionCode: req.query.transactionCode, 
    refundValue: req.query.refundValue

  }, function(err, result) {
    if(err) {
      return res.json(err)
    }
    return res.json({result: result})
  })
})

/**
 * rota para detalhar a transação
 */

routes.get('/details-transaction/:code', (req, res) => {
  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk, 
     token: token_pgbk, 
     sandbox: true,
     sandbox_email: email_pgbk
  })

  const codeTransaction = req.params.code;

  payment.getDetailsTransaction(codeTransaction, function(err, detailsTransaction) {
    if(err) {
      return res.json(err)
    }
    return res.json({transaction: detailsTransaction})
  })
})

/**
 * rota para listar as transações
 */

routes.get('/transactions', (req, res) => {
  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk, 
     token: token_pgbk, 
     sandbox: true,
     sandbox_email: email_pgbk
  })

  payment.getTransactions({
    reference: req.query.reference,
    inicialDate: req.query.inicialDate,
    finalDate: req.query.finalDate,
    page: req.query.page,
    maxPageResults: req.query.maxPageResults

  },function(err, transactions){
    if(err) {
      return res.json(err)
    }
    return res.json(transactions)
  })
})

/**
 * rota de criação da seção e de redirecionamento unificadas
 */
routes.post('/session-redirect', (req, res) => {
  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


   var payment = new PagSeguro({
     email: email_pgbk, 
     token: token_pgbk, 
     sandbox: true,
     sandbox_email: email_pgbk
  })

  payment.sessionId({
    currency: req.body.currency,
    itemId1: req.body.itemId1,
    itemDescription1: req.body.itemDescription1,
    itemAmount1: req.body.itemAmount1,
    itemQuantity1: req.body.itemQuantity1,
    itemWeight1: req.body.itemWeight1,
    reference: req.body.reference,
    senderName: req.body.senderName,
    //senderAreaCode: req.body.senderAreaCode,
    //senderPhone: req.body.senderPhone,
    //senderCPF: req.body.senderCPF,
    senderBornDate: req.body.senderBornDate,
    senderEmail: req.body.senderEmail,
    extraAmount: req.body.extraAmount,
    maxUses: req.body.maxUses,
    maxAge: req.body.maxAge,

   },function(err, sesson_id){
    if(err) {
      return res.json(err)
    }
    
    const {code, date} = sesson_id;

    const linkRedirect = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${code}`;

    return res.redirect(linkRedirect);
  })


})

/**
 * rota de criação da seção
 */
routes.post('/session', (req, res) => {

  const email_pgbk = 'seuemail@email.com';
  const token_pgbk = 'seutokensandboxouproducao';


    var payment = new PagSeguro({
      email: email_pgbk,
      token: token_pgbk,
      sandbox: true,
      sandbox_email: email_pgbk
   })

   payment.sessionId({
    currency: req.body.currency,
    itemId1: req.body.itemId1,
    itemDescription1: req.body.itemDescription1,
    itemAmount1: req.body.itemAmount1,
    itemQuantity1: req.body.itemQuantity1,
    itemWeight1: req.body.itemWeight1,
    reference: req.body.reference,
    senderName: req.body.senderName,
    //senderAreaCode: req.body.senderAreaCode,
    //senderPhone: req.body.senderPhone,
    //senderCPF: req.body.senderCPF,
    senderBornDate: req.body.senderBornDate,
    senderEmail: req.body.senderEmail,
    extraAmount: req.body.extraAmount,
    maxUses: req.body.maxUses,
    maxAge: req.body.maxAge,

   },function(err, sesson_id){
     if(err) {
       return res.json(err)
     }
     return res.json(sesson_id)
   })
})

/**
 * rota de redirecionamento p/ tela de pagamento
 */
routes.get('/redirect', (req, res) => {

  const linkRedirect = `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${req.query.code}`;

  return res.redirect(linkRedirect);

})


module.exports = routes;