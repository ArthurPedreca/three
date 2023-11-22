const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const port = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/refugiados", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => {
    console.error("Erro ao conectar com o MongoDB", err);
  });

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const ServicoSchema = new mongoose.Schema({
    nomeCompleto: { type: String, required: true },
    idade: { type: String, required: true },
    paisOrigem: { type: String, required: true },
    idiomasFalados: { type: String, required: true },
    principaisNecessidades: { type: String, required: true },
  });
  
  const Servico = mongoose.model("Servico", ServicoSchema);

app.post("/contato", async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).send("Preencher todos os campos obrigatórios");
  }

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send("O email informado já existe");
    }

    const novoUsuario = new Usuario({ nome, email, telefone });
    await novoUsuario.save();
    res.status(201).send("Usuário cadastrado com sucesso");
    console.log('Usuário cadastrado com sucesso')
  } catch (error) {
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

app.post("/cadastrousuario", async (req, res) => {
    const nomeCompleto = req.body.nomeCompleto;
    const idade = req.body.idade;
    const paisOrigem = req.body.paisOrigem;
    const idiomasFalados = req.body.idiomasFalados;
    const principaisNecessidades = req.body.principaisNecessidades;

  if (
    !nomeCompleto ||
    !idade ||
    !paisOrigem ||
    !idiomasFalados ||
    !principaisNecessidades
  ) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const novoServico = new Servico({
      nomeCompleto,
      idade,
      paisOrigem,
      idiomasFalados,
      principaisNecessidades,
    });
    await novoServico.save();
    res.status(201).send("Informações sobre o serviço enviadas com sucesso.");
  } catch (error) {
    res.status(500).send("Erro ao salvar as informações do serviço.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});