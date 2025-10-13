// mock-server.js
// Servidor de simulação (mock) para a API da aplicação de ocorrências.

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001; // Usaremos uma porta diferente da do React (que geralmente é 3000 ou 5173)
const JWT_SECRET = 'seu_segredo_super_secreto_para_testes'; // Em produção, use variáveis de ambiente!

// --- Middlewares ---
app.use(cors()); // Permite que o frontend React acesse esta API
app.use(express.json({ limit: '10mb' })); // Permite que o servidor entenda JSON e aumenta o limite para receber a imagem em Base64

// --- Banco de Dados em Memória (Simulação) ---
let users = [
    { id: 1, nome: 'Alice Silva', email: 'alice@exemplo.com', senha: '123', documento: '111.222.333-44' },
    { id: 2, nome: 'Gabriel Falcao', email: 'falcao@exemplo.com', senha: '123', documento: '222.333.444-55' }
];
let nextUserId = 3;


// --- Middleware de Autenticação ---
// Este middleware irá proteger as rotas que exigem login
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }
        req.user = userPayload; // Anexa o payload do usuário (ex: { id: 1, email: '...' }) à requisição
        next();
    });
};

// --- ROTAS DA API ---

// 1. Registro de Usuário
app.post('/api/usuarios/registrar', (req, res) => {
    console.log('Recebida requisição para /api/usuarios/registrar');
    const { nome, email, senha, documento } = req.body;

    if (!nome || !email || !senha || !documento) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    // ATENÇÃO: Em um app real, a senha DEVE ser hasheada com bcrypt!
    const newUser = { id: nextUserId++, nome, email, senha, documento };
    users.push(newUser);
    console.log('Novo usuário registrado:', newUser);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: { id: newUser.id, nome: newUser.nome } });
});

// 2. Login de Usuário
app.post('/api/usuarios/login', (req, res) => {
    console.log('Recebida requisição para /api/usuarios/login');
    const { email, senha } = req.body;
    const user = users.find(u => u.email === email && u.senha === senha);

    if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Gera o token JWT
    const tokenPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora

    console.log(`Usuário ${user.email} logado com sucesso.`);
    res.json({ message: 'Login bem-sucedido!', token, id: user.id });
});

// 3. Obter Perfil do Usuário (Rota Protegida)
app.get('/api/perfil/me', authenticateToken, (req, res) => {
    console.log(`Recebida requisição para /api/perfil/me pelo usuário ID: ${req.user.id}`);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Nunca retorne a senha na API!
    const { senha, ...userProfile } = user;
    res.json(userProfile);
});

// 4. Atualizar Perfil do Usuário (Rota Protegida)
app.put('/api/perfil/me', authenticateToken, (req, res) => {
    console.log(`Recebida requisição para ATUALIZAR /api/perfil/me pelo usuário ID: ${req.user.id}`);
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza os dados do usuário com o que foi enviado no corpo da requisição
    users[userIndex] = { ...users[userIndex], ...req.body };

    const { senha, ...updatedUserProfile } = users[userIndex];
    console.log('Perfil atualizado:', updatedUserProfile);
    res.json(updatedUserProfile);
});


// 5. Criar Ocorrência (Rota Protegida)
app.post('/api/ocorrencias', authenticateToken, (req, res) => {
    console.log(`Recebida requisição para /api/ocorrencias pelo usuário ID: ${req.user.id}`);
    const { url_pagina, timestamp, print_tela } = req.body;

    if (!url_pagina || !timestamp || !print_tela) {
        return res.status(400).json({ message: 'Dados da ocorrência incompletos.' });
    }

    // --- Simulação das Ações do Backend ---
    console.log('1. Simulando salvamento do print da tela...');
    console.log('2. Simulando chamada à API da Wayback Machine para:', url_pagina);
    console.log('3. Simulando geração de hash SHA-256 da imagem...');
    const hashSimulado = require('crypto').createHash('sha256').update(print_tela).digest('hex');

    const novaOcorrencia = {
        id: nextOcorrenciaId++,
        id_usuario_criador: req.user.id,
        url: url_pagina,
        timestamp: timestamp,
        hash_evidencia: hashSimulado,
        data_criacao: new Date().toISOString(),
        imagem: print_tela
    };
    ocorrencias.push(novaOcorrencia);

    console.log('Nova ocorrência criada:', novaOcorrencia);
    res.status(201).json({ message: 'Ocorrência criada com sucesso!', ocorrencia: novaOcorrencia });
});

// mock-server.js

// ... (todo o código existente: express, cors, jwt, middlewares, banco de dados em memória)

// --- ATUALIZE A ESTRUTURA DE DADOS MOCK ---
let ocorrencias = [
    // Adicionando alguns dados de exemplo para o usuário 'alice@exemplo.com' (id: 1)
    {
        id: 1,
        id_usuario_criador: 1,
        url: 'https://exemplo.com/pagina-ofensiva-1',
        hash_evidencia: 'a1b2c3d4e5f6...',
        status: 'ativa',
        gravidade: 'alta',
        tipo_crime: 'Discurso de Ódio',
        data_criacao: '2025-10-10T14:48:00.000Z',
        publica: false
    },
    {
        id: 2,
        id_usuario_criador: 2,
        url: 'https://forum.com/thread-ameacadora',
        hash_evidencia: 'f6e5d4c3b2a1...',
        status: 'arquivada',
        gravidade: 'media',
        tipo_crime: 'Ameaça',
        data_criacao: '2025-09-28T11:21:00.000Z',
        publica: true
    }
];
let nextOcorrenciaId = 3;



// --- NOVA ROTA PARA BUSCAR OCORRÊNCIAS ---
app.get('/api/ocorrencias', authenticateToken, (req, res) => {
    console.log(`Recebida requisição para GET /api/ocorrencias pelo usuário ID: ${req.user.id}`);

    // Filtra a lista de ocorrências para retornar apenas as que pertencem ao usuário autenticado
    const userOcorrencias = ocorrencias.filter(o => o.id_usuario_criador === req.user.id);

    console.log(`Encontradas ${userOcorrencias.length} ocorrências para o usuário.`);

    // Ordena da mais recente para a mais antiga
    userOcorrencias.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));

    res.json(userOcorrencias);
});


app.get('/api/ocorrencias/:id', authenticateToken, (req, res) => {
    const ocorrenciaId = parseInt(req.params.id, 10); // Pega o ID da URL e converte para número
    const userId = req.user.id; // Pega o ID do usuário do token JWT

    console.log(`Recebida requisição para GET /api/ocorrencias/${ocorrenciaId}`);

    // 1. Encontra a ocorrência no nosso "banco de dados"
    const ocorrencia = ocorrencias.find(o => o.id === ocorrenciaId);

    if (ocorrencia) {
        if (ocorrencia.publica || ocorrencia.id_usuario_criador == userId) {
            return res.json( {...ocorrencia, mesmoCriador: ocorrencia.id_usuario_criador == userId})
        }
    }

    // 2. Verifica se a ocorrência existe
    if (!ocorrencia || !ocorrencia.publica) {
        return res.status(404).json({ message: 'Ocorrência não encontrada.' });
    }

});


// --- NOVA ROTA PARA ATUALIZAR A VISIBILIDADE ---
app.patch('/api/ocorrencias/:id/visibilidade', authenticateToken, (req, res) => {
    const ocorrenciaId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { publica } = req.body; // Espera um corpo como: { "publica": true }

    console.log(`Recebida requisição PATCH para /api/ocorrencias/${ocorrenciaId}/visibilidade`);
    
    // Validação
    if (typeof publica !== 'boolean') {
        return res.status(400).json({ message: 'O campo "publica" deve ser um valor booleano (true/false).' });
    }

    const ocorrenciaIndex = ocorrencias.findIndex(o => o.id === ocorrenciaId);

    if (ocorrenciaIndex === -1) {
        return res.status(404).json({ message: 'Ocorrência não encontrada.' });
    }

    // VERIFICAÇÃO DE SEGURANÇA: Usuário só pode alterar sua própria ocorrência
    if (ocorrencias[ocorrenciaIndex].id_usuario_criador !== userId) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }
    
    // Atualiza o campo
    ocorrencias[ocorrenciaIndex].publica = publica;
    
    console.log(`Visibilidade da ocorrência ${ocorrenciaId} alterada para: ${publica}`);
    res.status(200).json(ocorrencias[ocorrenciaIndex]); // Retorna a ocorrência atualizada
});


// --- ATUALIZE A MENSAGEM DE LOG PARA INCLUIR A NOVA ROTA ---
app.listen(PORT, () => {
    console.log(`Servidor mock rodando na porta ${PORT}`);
    console.log(`Endpoints disponíveis:
    - POST /api/usuarios/registrar
    - POST /api/usuarios/login
    - GET  /api/perfil/me (protegido)
    - PUT  /api/perfil/me (protegido)
    - POST /api/ocorrencias (protegido)
    - GET  /api/ocorrencias (protegido) <-- NOVO ENDPOINT
`);
});