
# Cybersecurity Threat Detection Platform

![Cybersecurity Banner](https://example.com/banner-image.png)

## 🛡️ Visão geral

Esta plataforma de detecção de ameaças de segurança cibernética potencializada por IA oferece monitoramento em tempo real, análise de incidentes e integração com importantes feeds de inteligência de ameaças. O dashboard interativo permite visualizar, analisar e responder rapidamente a potenciais ameaças de segurança.

## 🔍 Funcionalidades principais

- **Monitoramento em tempo real**: Visualização de alertas e anomalias de segurança conforme elas ocorrem
- **Dashboard analítico**: Painéis e gráficos intuitivos para visualização de dados de segurança
- **Análise de logs**: Capacidade de fazer upload e analisar arquivos de log em busca de atividades suspeitas
- **Integração com OTX (Open Threat Exchange)**: Verificação de IPs, domínios e hashes contra a inteligência de ameaças da AlienVault
- **Integração com VirusTotal**: Análise de arquivos, URLs, IPs e domínios contra múltiplos mecanismos antivírus
- **Mapa global de ameaças**: Visualização geográfica das fontes de ataques e atividades maliciosas
- **Alertas em tempo real**: Notificações instantâneas quando novas ameaças são detectadas

## 🔧 Tecnologias utilizadas

- **Frontend**: React, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui
- **Gerenciamento de estado**: TanStack Query (React Query)
- **Visualização de dados**: Recharts
- **API e integração**: Axios, Supabase
- **Serviços de segurança**: VirusTotal API, AlienVault OTX API

## 📊 Arquitetura

O projeto segue uma arquitetura modular composta por:

- **Camada de apresentação**: Componentes React organizados por função
- **Camada de serviços**: Módulos para interação com APIs externas (VirusTotal, OTX) e internas
- **Camada de análise**: Processamento e análise de dados de segurança em tempo real
- **Camada de persistência**: Armazenamento e cache de dados via Supabase

### Diagrama da arquitetura

```
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   Interface   │◄─────────►│   Serviços    │◄─────────►│  APIs Externas │
│     React     │           │  de Análise   │           │  (VT, OTX)    │
└───────────────┘           └───────────────┘           └───────────────┘
        ▲                           ▲                           ▲
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│Armazenamento  │◄─────────►│    Cache e    │◄─────────►│   Análise     │
│   Supabase    │           │    Estado     │           │ em Tempo Real  │
└───────────────┘           └───────────────┘           └───────────────┘
```

## 🚀 Instalação e execução

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Chaves de API para VirusTotal e OTX (opcional, mas recomendado para funcionalidade completa)

### Configuração

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/cybersecurity-platform.git
   cd cybersecurity-platform
   ```

2. Instale as dependências:
   ```sh
   npm install
   # ou
   yarn install
   ```

3. Execute a aplicação em modo de desenvolvimento:
   ```sh
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse a aplicação em `http://localhost:8080`

## ⚙️ Configuração de APIs

### VirusTotal API

1. Obtenha uma chave de API gratuita em [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Adicione sua chave de API através da interface do analisador de VirusTotal no dashboard

### AlienVault OTX (Open Threat Exchange)

1. Crie uma conta em [AlienVault OTX](https://otx.alienvault.com/)
2. Obtenha sua chave de API no perfil do usuário
3. Adicione sua chave de API através da interface do analisador OTX no dashboard

## 📋 Estrutura do projeto

```
src/
├── components/      # Componentes reutilizáveis da UI
│   ├── Dashboard/   # Componentes específicos do dashboard
│   └── ui/          # Componentes base da UI (shadcn)
├── hooks/           # Hooks personalizados React
├── lib/            # Utilitários e funções auxiliares
├── pages/          # Componentes de páginas/rotas
├── services/       # Serviços de API e integração
│   ├── api/        # Serviços da API interna
│   ├── otx/        # Serviços da API OTX
│   └── virusTotal/ # Serviços da API VirusTotal
└── types/          # Definições de tipos TypeScript
```

## 🔐 Segurança

- Todas as chaves de API são armazenadas apenas no navegador do cliente
- Recomenda-se integração com Supabase para armazenamento seguro de credenciais em ambiente de produção
- Os dados sensíveis nunca são compartilhados externamente

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 📞 Contato

Para dúvidas ou suporte, entre em contato através de [linkedin](https://www.linkedin.com/in/pamelaascefcazarini/).

---

Desenvolvido com ❤️ por [Pâm]
