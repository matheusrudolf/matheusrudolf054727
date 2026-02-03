# Sistema de Gerenciamento de Pets

Sistema web desenvolvido em Angular para gerenciamento de pets e tutores, permitindo cadastro, listagem, edição e vinculação entre pets e seus responsáveis.

## Sobre o Projeto

Este projeto foi desenvolvido como parte de um processo seletivo e tem como objetivo demonstrar habilidades em desenvolvimento front-end com Angular, consumo de APIs REST e implementação de funcionalidades CRUD completas.

O sistema permite o gerenciamento completo de pets e tutores, incluindo upload de fotos, aplicação de máscaras em formulários e autenticação de usuários.

## Funcionalidades Implementadas

### 1. Tela Inicial - Listagem de Pets
- ✅ Listagem de todos os pets cadastrados via `GET /v1/pets`
- ✅ Exibição de cards com informações do pet (foto, nome, espécie, idade)
- ✅ Paginação (10 pets por página)
- ✅ Busca por nome para filtrar pets
- ✅ Navegação para tela de detalhamento ao clicar no card

### 2. Tela de Detalhamento do Pet
- ✅ Exibição completa dos dados do pet via `GET /v1/pets/{id}`
- ✅ Informações do tutor (se houver) com destaque no nome
- ✅ Upload de foto via `POST /v1/pets/{id}/fotos`
- ✅ Navegação para edição do pet

### 3. Tela de Cadastro/Edição de Pet
- ✅ Formulário para novo pet via `POST /v1/pets`
- ✅ Edição de pet existente via `PUT /v1/pets/{id}`
- ✅ Campos: nome, espécie, idade, raça
- ✅ Aplicação de máscaras quando necessário
- ✅ Validação de campos obrigatórios

### 4. Tela de Cadastro/Edição de Tutor
- ✅ Cadastro de tutores via `POST /v1/tutores`
- ✅ Atualização via `PUT /v1/tutores/{id}`
- ✅ Campos: nome completo, telefone, endereço
- ✅ Upload de foto via `POST /v1/tutores/{id}/fotos`
- ✅ Vinculação Pet-Tutor na tela do tutor
- ✅ Listagem de pets vinculados ao tutor
- ✅ Vinculação de novos pets via `POST /v1/tutores/{id}/pets/{petId}`
- ✅ Remoção de vínculo via `DELETE /v1/tutores/{id}/pets/{petId}`

### 5. Autenticação
- ✅ Sistema de login via `POST /autenticacao/login`
- ✅ Geração e gerenciamento de token JWT via `PUT /autenticacao/refresh`
- ✅ Proteção de rotas autenticadas

## Arquitetura do Projeto

```
src/
├── app/
│   ├── core/                       # Módulo central da aplicação
│   │   ├── abstract.service.ts     # Classe base abstrata para serviços
│   │   ├── auth.service.ts         # Serviço de autenticação
│   │   ├── export.service.ts       # Serviço de exportação de dados
│   │   ├── pets.service.ts         # Serviço de gerenciamento de pets
│   │   └── tutores.service.ts      # Serviço de gerenciamento de tutores
│   │
│   ├── layout/                     # Componentes de layout
│   │   └── (estrutura principal da aplicação)
│   │
│   ├── pages/                      # Páginas da aplicação
│   │   ├── auth/                   # Módulo de autenticação
│   │   │   ├── accessdenied/       # Página de acesso negado
│   │   │   ├── login/              # Página de login
│   │   │   ├── auth.guard.ts       # Guard de autenticação
│   │   │   ├── auth.interceptor.ts # Interceptor HTTP para token
│   │   │   └── auth.routes.ts      # Rotas de autenticação
│   │   │
│   │   ├── notfound/               # Página 404
│   │   ├── pets/                   # Módulo de pets
│   │   └── tutores/                # Módulo de tutores
│   │
│   ├── shared/                     # Recursos compartilhados
│   │   ├── classes/                # Classes utilitárias
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── enums/                  # Enumeradores
│   │   ├── models/                 # Interfaces e tipos
│   │   └── utils/                  # Funções utilitárias
│   │
│   ├── assets/                     # Recursos estáticos
│   │
│   ├── environments/               # Configurações de ambiente
│   │   └── environment.local.ts    # Variáveis de ambiente local
│   │
│   ├── app.component.ts            # Componente raiz
│   ├── app.config.ts               # Configurações da aplicação
│   ├── app.routes.ts               # Configuração de rotas principais
│   ├── index.html                  # HTML principal
│   └── main.ts                     # Ponto de entrada da aplicação
```

### Padrões Utilizados

- **Arquitetura em Camadas**: Separação clara entre camadas (Core, Pages, Shared)
- **Abstract Service Pattern**: Classe base `abstract.service.ts` para padronizar operações CRUD
- **Services Pattern**: Serviços especializados no Core (auth, pets, tutores, export)
- **Reactive Forms**: Formulários reativos com validação
- **Route-based Lazy Loading**: Rotas organizadas por módulos (auth.routes.ts, etc.)
- **Guards & Interceptors**: Proteção de rotas (`auth.guard.ts`) e manipulação de requisições (`auth.interceptor.ts`)
- **Shared Resources**: Componentes, modelos, enums e utilitários reutilizáveis
- **Environment Configuration**: Configuração centralizada de ambientes

### Organização por Responsabilidade

**Core** (`/core`)
- Contém os serviços fundamentais da aplicação
- `abstract.service.ts`: Classe base com métodos CRUD genéricos
- Serviços específicos herdam do serviço abstrato para reutilização de código
- Centraliza a lógica de comunicação com a API

**Pages** (`/pages`)
- Organizado por funcionalidade (auth, pets, tutores)
- Cada módulo possui suas próprias rotas
- Auth contém guard e interceptor para segurança
- Separação de responsabilidades por domínio

**Shared** (`/shared`)
- `classes/`: Classes utilitárias reutilizáveis
- `components/`: Componentes UI compartilhados
- `enums/`: Enumeradores para valores constantes
- `models/`: Interfaces TypeScript para tipagem forte
- `utils/`: Funções auxiliares

**Environments** (`/environments`)
- Configurações específicas por ambiente
- `environment.local.ts`: Configurações de desenvolvimento local
- Facilita deploy em diferentes ambientes

## Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Material** ou **Bootstrap** - UI Components
- **JWT** - Autenticação e autorização

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com Node.js)
- [Angular CLI](https://angular.io/cli) (versão 18 ou superior)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version
```

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pet-management-system.git
cd pet-management-system
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Edite o arquivo `src/environments/environment.ts` com a URL da API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://sua-api.com/api'
};
```

### 4. Execute o projeto

```bash
# Modo de desenvolvimento
ng serve

# Ou especificando a porta
ng serve --port 4200
```

Acesse no navegador: `http://localhost:4200`

### 5. Build para produção

```bash
ng build --configuration production
```

Os arquivos compilados estarão na pasta `dist/`.

## 🧪 Como Testar

### Testes Unitários

```bash
# Executar todos os testes
ng test

# Executar com cobertura
ng test --code-coverage
```

### Testes End-to-End

```bash
# Executar testes e2e
ng e2e
```

## 📡 Endpoints da API

### Autenticação
- `POST /autenticacao/login` - Realizar login
- `PUT /autenticacao/refresh` - Renovar token

### Pets
- `GET /v1/pets` - Listar todos os pets (com paginação)
- `GET /v1/pets/{id}` - Buscar pet por ID
- `POST /v1/pets` - Cadastrar novo pet
- `PUT /v1/pets/{id}` - Atualizar pet
- `POST /v1/pets/{id}/fotos` - Upload de foto do pet

### Tutores
- `GET /v1/tutores` - Listar todos os tutores
- `GET /v1/tutores/{id}` - Buscar tutor por ID
- `POST /v1/tutores` - Cadastrar novo tutor
- `PUT /v1/tutores/{id}` - Atualizar tutor
- `POST /v1/tutores/{id}/fotos` - Upload de foto do tutor
- `POST /v1/tutores/{id}/pets/{petId}` - Vincular pet ao tutor
- `DELETE /v1/tutores/{id}/pets/{petId}` - Remover vínculo

## Requisitos Atendidos

### Requisitos Específicos ✅
1. ✅ Tela Inicial - Listagem de Pets
2. ✅ Tela de Detalhamento do Pet
3. ✅ Tela de Cadastro/Edição de Pet
4. ✅ Tela de Cadastro/Edição de Tutor
5. ✅ Autenticação

### Requisitos para Sênior ⭐
- ✅ Health Checks e Liveness/Readiness
- ✅ Testes unitários com boa cobertura
- ✅ Padrão Facade (arquitetura em camadas) e gerenciamento de estado com BehaviorSubject

## Melhorias Implementadas

- **UX/UI**: Interface responsiva e intuitiva
- **Feedback Visual**: Loading states e mensagens de erro/sucesso
- **Validações**: Validação de formulários em tempo real
- **Máscaras**: Aplicação de máscaras em campos de telefone, CEP, etc.
- **Paginação**: Navegação eficiente em grandes listas
- **Busca**: Filtro por nome com debounce

## Estrutura de Dados

### Pet
```typescript
interface Pets {
    id?: number;
    nome?: string;
    raca?: string;
    idade?: number;
    foto?: Foto;
    tutores?: Tutores[];
}
```

### Tutor
```typescript
interface Tutores {
    id?: number;
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cpf?: number;
    foto?: Foto;
}
```

### Foto
```typescript
interface Foto {
    id?: number;
    nome?: string;
    contentType?: string;
    url?: string;
}
```

## Desenvolvedor

**Matheus Rondon Rudolf**
- GitHub: https://github.com/matheusrudolf
- LinkedIn: https://linkedin.com/in/matheus-rondon-rudolf-733a5b116
- Email: matheusrudolf@hotmail.com
- N° Inscrição : 16285
- Vaga: ANALISTA DE TECNOLOGIA DA INFORMAÇÃO - ENGENHEIRO DA COMPUTAÇÃO - SÊNIOR
