# VORA — Protótipo Cliente

Protótipo front-end da experiência do **cliente** na plataforma VORA: concierge de descoberta e reserva de companhia adulta verificada (dados e perfis 100% fictícios).

> **Protótipo** — sem backend real, sem pagamento real, sem autenticação real.

## Como instalar

```bash
npm install
```

## Como executar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run lint
npm run build
npm run start
```

## Fluxo rápido de teste (aceite)

1. Confirme maioridade e conclua o onboarding.
2. Em **Descobrir**, escreva:  
   `Quero alguém disponível agora, até 2 km, baixinha, com cabelo escuro, que fale francês e goste de jantar.`
3. Veja os chips de filtros, ajuste se quiser e execute a busca.
4. Passe o primeiro perfil, abra/favorite o segundo, envie solicitação de **60 min**.
5. Na reserva, use o **Modo demo** (somente em desenvolvimento):
   - Profissional aceitou → Pix simulado
   - Pagamento aprovado → chat liberado
6. Faça check-in, inicie o encontro, abra a central de segurança.
7. Finalize pelo cliente; no demo, simule a confirmação da outra parte.
8. Envie a avaliação privada.

## Estrutura do projeto

```
src/
  app/                  # Rotas (App Router)
  components/
    brand/              # Logo e identidade
    discovery/          # Concierge, card, filtros
    profiles/           # (perfil vive em app + booking)
    booking/            # Solicitação, status, check-in, review, demo
    payment/            # Pix simulado
    chat/               # Chat privado
    safety/             # Central de segurança
    navigation/         # Header desktop + nav mobile
    entry/              # Maioridade / onboarding
    ui/                 # Primitivos
  data/                 # Perfis fictícios
  hooks/
  lib/                  # Parser, state machine, utils
  services/             # Adaptadores (mocks → futuras APIs)
  stores/               # Zustand + localStorage
  types/
public/profiles/        # Placeholders editoriais SVG
```

### Rotas

| Rota | Função |
|------|--------|
| `/` | Entrada e verificação de maioridade |
| `/descobrir` | VORA Concierge |
| `/perfil/[slug]` | Perfil completo |
| `/reservas` | Lista de reservas |
| `/reserva/[id]` | Acompanhamento |
| `/reserva/[id]/pagamento` | Pix simulado |
| `/reserva/[id]/chat` | Chat (após pagamento) |
| `/reserva/[id]/seguranca` | Central de segurança |
| `/favoritos` | Favoritos |
| `/mensagens` | Conversas ativas |
| `/conta` | Conta e reset do protótipo |

## Modo demo

Disponível **somente em `NODE_ENV === "development"`**, no detalhe da reserva (`DemoPanel`).

Simula ações externas sem backend:

- Profissional visualizou / aceitou / recusou
- Pagamento aprovado
- Confirmação de encerramento pela outra parte
- Abrir divergência (análise)

O estado da reserva é tipado e validado em `src/lib/booking-state.ts`, persistido via Zustand em `localStorage` (`vora-client-v1`).

## Onde substituir mocks por APIs

Toda a UI deve consumir os adaptadores em `src/services/`:

| Arquivo | Responsabilidade |
|---------|------------------|
| `matching.ts` | Parser de match / listagem de perfis |
| `bookings.ts` | Criação e transição de reservas |
| `payments.ts` | Pix simulado |
| `chat.ts` | Mensagens e sanitização |
| `safety.ts` | Suporte e emergência |

Substitua o corpo dessas funções por `fetch`/SDK real mantendo as assinaturas. O store (`src/stores/vora-store.ts`) orquestra o fluxo e a persistência local.

## Onde adicionar imagens

Coloque fotos editoriais (não sexualizadas) em:

```
public/profiles/
```

Atualize os caminhos em `src/data/profiles.ts` (`images: [...]`).

Os arquivos atuais são placeholders SVG com o aviso “Protótipo · Perfil fictício”. Prefira JPG/WebP reais de stock com licença adequada, sempre rotulados como fictícios.

## Decisões de UX importantes

- **Concierge, não catálogo**: uma opção por vez; sem grade de perfis.
- **Parser local**: texto natural → chips/filtros; menções raciais são ignoradas com aviso discreto.
- **Valor mínimo**: R$ 500 / 30 min (escala proporcional até 120 min); nunca abaixo.
- **Companhia adulta não sexual**: experiências sociais (jantar, evento, dança, etc.).
- **Sem filtros de raça/cor/etnia**; sem avaliações de aparência.
- **Pix apenas visual**; chat só após pagamento confirmado (simulado).
- **Segurança**: hold de ~2s para risco imediato; 190 / 192 visíveis; a VORA não substitui emergência pública.
- **Finalização mútua**: ambos confirmam → concluída; divergência → análise.
- Identidade visual: carbon / ivory / vermilion; tipografia grotesca (Outfit); órbita no “O” da marca.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Zustand · React Hook Form · Zod · Sonner · Lucide

## Comando para iniciar

```bash
npm run dev
```
