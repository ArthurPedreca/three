const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//configurando o express para o postman e para usar a pagina
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;

//configurando o banco de dados
mongoose.connect("mongodb://127.0.0.1:27017/bem_estar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
});

//criando a model do seu projeto
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String },
  senha: { type: String, required: true },
  telefone: { type: String },
  endereco: { type: String },
  email: { type: String, required: true },
  nacionalidade: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

//configuração dos roteamendos
//cadastrousuario
app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const senha = req.body.senha;
  const telefone = req.body.telefone;
  const endereco = req.body.endereco;
  const email = req.body.email;
  const nacionalidade = req.body.nacionalidade;


  //validação de campos

//   if(nome === null || senha === null || telefone === null || endereco === null || email === null || nacionalidade === null){
//     return res.status(400).json({error : "Preencher todos os campos!!!"});
// }

  //teste de duplicidade
  const emailExiste = await Usuario.findOne({email : email});

  if(emailExiste){
    return res.status(400).json({error : "O email informado já existe"});
  }

  
  const usuario = new Usuario({
    nome: nome,
    senha: senha,
    telefone: telefone,
    endereco: endereco,
    email: email,
    nacionalidade: nacionalidade
  });

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
  } catch (error) {}
});

//rota de get de formulario
app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastro.html");
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});