# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Arquitetura do Projeto

Esta é uma aplicação desktop Tauri com frontend React + TypeScript e backend Rust.

**Estrutura do Frontend:**
- React 18 + TypeScript + servidor de desenvolvimento Vite
- Ponto de entrada principal: `src/main.tsx`
- Componentes no diretório `src/`
- Vite serve na porta 1420 (porta fixa para integração com Tauri)

**Estrutura do Backend:**
- Biblioteca Rust em `src-tauri/src/lib.rs` com lógica principal da aplicação
- Ponto de entrada binário em `src-tauri/src/main.rs` que chama `gojira_lib::run()`
- Comandos Tauri para comunicação frontend-backend
- Usa `tauri-plugin-opener` para integrações do sistema

**Arquivos de Configuração Principais:**
- `src-tauri/tauri.conf.json`: Configuração da aplicação Tauri (configurações de janela, comandos de build)
- `src-tauri/Cargo.toml`: Dependências Rust e configuração da biblioteca
- `package.json`: Dependências do frontend e scripts npm
- `vite.config.ts`: Configuração do Vite otimizada para desenvolvimento Tauri

## Comandos Comuns de Desenvolvimento

**Desenvolvimento:**
```bash
npm run dev          # Inicia servidor dev do Vite e Tauri em modo desenvolvimento
npm run tauri dev    # Forma alternativa de iniciar desenvolvimento Tauri
```

**Build:**
```bash
npm run build        # Compila TypeScript e cria bundle de produção
npm run tauri build  # Compila a aplicação Tauri completa para distribuição
```

**Apenas Frontend:**
```bash
npm run preview      # Visualiza o frontend compilado
```

**CLI do Tauri:**
```bash
npm run tauri        # Acessa comandos da CLI do Tauri
```

## Fluxo de Desenvolvimento

A aplicação usa o modelo padrão de desenvolvimento do Tauri onde:
1. Frontend executa em http://localhost:1420 via Vite
2. Backend compila para uma biblioteca nativa integrada com o frontend
3. Comunicação acontece através de comandos Tauri (veja comando `greet` em `src-tauri/src/lib.rs:3`)

O processo de build requer tanto compilação TypeScript (`tsc`) quanto bundling do Vite antes que o Tauri possa empacotar a aplicação final.

# Recursos Externos
## MCP Context7
- **Quando usar**: Sempre que precisar de informações que não estão no projeto
- **Sintaxe**: `@context7:sua_consulta_aqui`
- **Casos de uso**:
  - Documentação de bibliotecas
  - Padrões de arquitetura
  - Soluções para problemas específicos
  - Validação de implementações

**Regra**: Antes de sugerir uma solução complexa, consulte o context7 para verificar se existe uma abordagem melhor ou mais atual.