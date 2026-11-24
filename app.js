const express = require('express');

const app = express();
const PORT = 3000;

// Permite receber dados JSON no corpo das requisições.
app.use(express.json());

// Dados simulados em memória.
let produtos = [
  {
    id: 1,
    nome: 'Notebook',
    preco: 3500,
    estoque: 10,
    categoria: 'Informatica'
  },
  {
    id: 2,
    nome: 'Mouse Gamer',
    preco: 150,
    estoque: 50,
    categoria: 'Informatica'
  },
  {
    id: 3,
    nome: 'Teclado Mecânico',
    preco: 450,
    estoque: 30,
    categoria: 'Informatica'
  }
];

let proximoId = 4;

// GET /produtos - Lista todos os produtos.
app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

// GET /produtos/busca?nome=texto - Busca produtos pelo nome.
app.get('/produtos/busca', (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({
      mensagem: 'Informe o parâmetro nome'
    });
  }

  const resultado = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(nome.toLowerCase())
  );

  res.status(200).json(resultado);
});

// GET /produtos/estoque-baixo - Lista produtos com menos de 10 unidades.
app.get('/produtos/estoque-baixo', (req, res) => {
  const criticos = produtos.filter(produto => produto.estoque < 10);
  res.status(200).json(criticos);
});

// GET /produtos/categoria/:categoria - Lista produtos por categoria.
app.get('/produtos/categoria/:categoria', (req, res) => {
  const { categoria } = req.params;

  const resultado = produtos.filter(produto =>
    produto.categoria.toLowerCase() === categoria.toLowerCase()
  );

  res.status(200).json(resultado);
});

// GET /produtos/:id - Busca um produto pelo ID.
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido - deve ser um número'
    });
  }

  const produto = produtos.find(item => item.id === id);

  if (produto) {
    return res.status(200).json(produto);
  }

  res.status(404).json({
    mensagem: `Produto ${id} não encontrado`
  });
});

// POST /produtos - Cria um novo produto.
app.post('/produtos', (req, res) => {
  const { nome, preco, estoque, categoria } = req.body;

  if (!nome || preco === undefined || estoque === undefined || !categoria) {
    return res.status(400).json({
      mensagem: 'Campos obrigatórios: nome, preco, estoque, categoria'
    });
  }

  const precoNumerico = parseFloat(preco);
  const estoqueNumerico = parseInt(estoque);

  if (isNaN(precoNumerico) || precoNumerico <= 0) {
    return res.status(400).json({
      mensagem: 'Preço deve ser maior que zero'
    });
  }

  if (isNaN(estoqueNumerico) || estoqueNumerico < 0) {
    return res.status(400).json({
      mensagem: 'O estoque não pode ser negativo'
    });
  }

  const novoProduto = {
    id: proximoId++,
    nome,
    preco: precoNumerico,
    estoque: estoqueNumerico,
    categoria
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// PUT /produtos/:id - Substitui todos os dados de um produto.
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, estoque, categoria } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido - deve ser um número'
    });
  }

  if (!nome || preco === undefined || estoque === undefined || !categoria) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios'
    });
  }

  const precoNumerico = parseFloat(preco);
  const estoqueNumerico = parseInt(estoque);

  if (isNaN(precoNumerico) || precoNumerico <= 0) {
    return res.status(400).json({
      mensagem: 'Preço deve ser maior que zero'
    });
  }

  if (isNaN(estoqueNumerico) || estoqueNumerico < 0) {
    return res.status(400).json({
      mensagem: 'O estoque não pode ser negativo'
    });
  }

  const index = produtos.findIndex(produto => produto.id === id);

  if (index === -1) {
    return res.status(404).json({
      mensagem: `Produto ${id} não encontrado`
    });
  }

  produtos[index] = {
    id,
    nome,
    preco: precoNumerico,
    estoque: estoqueNumerico,
    categoria
  };

  res.status(200).json(produtos[index]);
});

// DELETE /produtos/:id - Remove um produto.
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido - deve ser um número'
    });
  }

  const index = produtos.findIndex(produto => produto.id === id);

  if (index === -1) {
    return res.status(404).json({
      mensagem: `Produto ${id} não encontrado`
    });
  }

  produtos.splice(index, 1);

  res.status(200).json({
    mensagem: `Produto ${id} removido com sucesso`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse http://localhost:${PORT}/produtos`);
});
