import bcrypt from 'bcryptjs';
import { compare, logActivity } from '../config/database.js';
import { criarUsuario, buscarUsuarioPorEmail, buscarUsuarioPorCPF, buscarUsuarioPorId, atualizarUsuario, excluirUsuario } from '../models/Usuario.js';


// Cadastrar novo usuário
const cadastrarUsuarioController = async (req, res) => {
  try {
    const { nome, email, telefone, cpf, senha, pergunta_secreta, resposta_secreta } = req.body;

    // Verificar se e-mail já existe
    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'E-mail já cadastrado'
      });
    }

    // Verificar se CPF já existe
    const cpfExistente = await buscarUsuarioPorCPF(cpf);
    if (cpfExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'CPF já cadastrado'
      });
    }

    // Gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const respostaHash = await bcrypt.hash(resposta_secreta, salt);

    // Preparar dados para inserção
    const dadosUsuario = {
      nome,
      email,
      telefone,
      cpf,
      senha_hash: senhaHash,
      pergunta_secreta,
      resposta_hash: respostaHash
      // Remover a linha com criado_em
    };

    // Inserir usuário no banco
    const userId = await criarUsuario(dadosUsuario);
    
    // Registrar log de atividade
    await logActivity(userId, 'cadastro', 'Usuário criou conta');

    res.status(201).json({
      status: 'success',
      message: 'Usuário cadastrado com sucesso',
      data: { id: userId }
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao cadastrar usuário' 
    });
  }
};

// Realizar login
const loginController = async (req, res) => {
  try {
    const { login, senha } = req.body;
    
    // Buscar usuário por email ou CPF
    let usuario;
    
    if (login.includes('@')) {
      usuario = await buscarUsuarioPorEmail(login);
    } else {
      usuario = await buscarUsuarioPorCPF(login);
    }
    
    if (!usuario) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Verificar senha
    const senhaCorreta = await compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Senha incorreta' 
      });
    }
    
    // Registrar log de atividade
    await logActivity(usuario.id, 'login', 'Usuário realizou login');

    // Remover dados sensíveis
    delete usuario.senha_hash;
    delete usuario.resposta_hash;

    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        usuario
      }
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao realizar login' 
    });
  }
};

// Recuperar senha com pergunta secreta
const recuperarSenhaController = async (req, res) => {
  try {
    const { email, resposta_secreta, nova_senha } = req.body;

    // Buscar usuário por CPF
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Verificar resposta secreta
    const respostaCorreta = await compare(resposta_secreta, usuario.resposta_hash);
    if (!respostaCorreta) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Resposta secreta incorreta' 
      });
    }
    
    // Gerar hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const novoHash = await bcrypt.hash(nova_senha, salt);
    
    // Atualizar senha
    await atualizarUsuario(usuario.id, { senha_hash: novoHash });
    
    // Registrar log de atividade
    await logActivity(usuario.id, 'redefinir_senha', 'Usuário redefiniu sua senha');

    res.status(200).json({
      status: 'success',
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao recuperar senha' 
    });
  }
};

// Obter perfil do usuário
const obterPerfilController = async (req, res) => {
  try {
    const userId = req.query.userId; // Obter userId da query string

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'O parâmetro userId é obrigatório.'
      });
    }

    // Buscar usuário por ID
    const usuario = await buscarUsuarioPorId(userId);
    
    if (!usuario) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Remover dados sensíveis
    delete usuario.senha_hash;
    delete usuario.resposta_hash;

    res.status(200).json({
      status: 'success',
      data: usuario
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao obter perfil' 
    });
  }
};

// Atualizar dados do usuário
const atualizarPerfilController = async (req, res) => {
  try {
    const userId = req.query.userId; // Obter userId da query string
    const { nome, telefone, senha, pergunta_secreta, resposta_secreta } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'O parâmetro userId é obrigatório.'
      });
    }

    // Verificar se usuário existe
    const usuario = await buscarUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Preparar dados para atualização
    const dadosParaAtualizar = {};
    
    if (nome) dadosParaAtualizar.nome = nome;
    if (telefone) dadosParaAtualizar.telefone = telefone;
    
    // Se senha foi fornecida, gerar novo hash
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      dadosParaAtualizar.senha_hash = await bcrypt.hash(senha, salt);
    }
    
    // Se pergunta e resposta foram fornecidas, atualizar
    if (pergunta_secreta && resposta_secreta) {
      dadosParaAtualizar.pergunta_secreta = pergunta_secreta;
      const salt = await bcrypt.genSalt(10);
      dadosParaAtualizar.resposta_hash = await bcrypt.hash(resposta_secreta, salt);
    }
    
    // Atualizar usuário
    await atualizarUsuario(userId, dadosParaAtualizar);
    
    // Registrar log de atividade
    await logActivity(userId, 'atualizar_perfil', 'Usuário atualizou dados do perfil');

    res.status(200).json({
      status: 'success',
      message: 'Perfil atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao atualizar perfil' 
    });
  }
};

// Excluir conta do usuário
const excluirContaController = async (req, res) => {
  try {
    const userId = req.query.userId; // Obter userId da query string

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'O parâmetro userId é obrigatório.'
      });
    }

    // Verificar se usuário existe
    const usuario = await buscarUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Excluir usuário
    await excluirUsuario(userId);
    
    // Registrar log de atividade (não será armazenado se a tabela tiver chave estrangeira para usuários)
    try {
      await logActivity(userId, 'excluir_conta', 'Usuário excluiu sua conta');
    } catch (err) {
      console.info('Não foi possível registrar log para usuário excluído');
    }

    res.status(200).json({
      status: 'success',
      message: 'Conta excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao excluir conta' 
    });
  }
};

// Obter pergunta secreta do usuário (adicionado na resposta anterior, mantido)
const obterPerguntaSecretaController = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'O parâmetro email é obrigatório.'
      });
    }

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }

    if (!usuario.pergunta_secreta) {
        return res.status(404).json({
            status: 'error',
            message: 'Usuário não possui pergunta secreta cadastrada.'
        });
    }

    res.status(200).json({
      status: 'success',
      data: {
        pergunta_secreta: usuario.pergunta_secreta
      }
    });

  } catch (error) {
    console.error('Erro ao obter pergunta secreta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter pergunta secreta.'
    });
  }
};

export { cadastrarUsuarioController, loginController, recuperarSenhaController, obterPerfilController, atualizarPerfilController, excluirContaController, obterPerguntaSecretaController };