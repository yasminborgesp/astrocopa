# AstroCopa — Guia de Deploy e Manutenção

## Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com)
- Conta na [Vercel](https://vercel.com) (recomendado)

---

## 1. Configurar Supabase

### 1.1 Criar projeto
1. Acesse https://supabase.com/dashboard
2. New Project → defina nome, senha e região (Brazil South recomendado)

### 1.2 Criar tabelas
1. SQL Editor → colar e executar `supabase/schema.sql`
2. SQL Editor → colar e executar `supabase/rls.sql`

### 1.3 Criar bucket de storage
1. Storage → New Bucket
2. Nome: `astrocopa-media`
3. Marcar como **Public** (para a tela da TV ler as imagens sem autenticação)
4. SQL Editor → colar e executar `supabase/storage.sql`

### 1.4 Criar usuário admin
1. Authentication → Users → Invite user
2. Digite o e-mail do responsável pelo endomarketing
3. O usuário receberá o e-mail de convite para definir senha

### 1.5 Pegar chaves de API
1. Project Settings → API
2. Copiar: **Project URL** e **anon public**

---

## 2. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Preencha os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

---

## 3. Rodar localmente

```bash
npm install
npm run dev
```

- Tela TV: http://localhost:3000/tv
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin

---

## 4. Deploy na Vercel

### 4.1 Via CLI
```bash
npm i -g vercel
vercel
```

### 4.2 Via interface
1. Vercel → New Project → importar repositório
2. Em **Environment Variables** adicionar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### 4.3 URL das TVs
Após deploy, configurar nas TVs:
```
https://seu-projeto.vercel.app/tv
```
Colocar em modo tela cheia (F11 no Chrome) e kiosk mode.

---

## 5. Configurar TVs

### Chrome Kiosk Mode (recomendado)
```bash
# Windows
chrome.exe --kiosk --start-fullscreen https://seu-projeto.vercel.app/tv

# macOS
open -a "Google Chrome" --args --kiosk https://seu-projeto.vercel.app/tv
```

### Chrome normal
1. Abrir `https://seu-projeto.vercel.app/tv`
2. Pressionar F11 para tela cheia
3. A tela atualiza automaticamente via Supabase Realtime

---

## 6. Uso do Admin

### Login
- URL: `/admin/login`
- Use o e-mail e senha criados no Supabase

### Upload de imagens
1. `/admin/media` → arraste imagens ou clique para selecionar
2. Formatos aceitos: JPG, PNG, WEBP (máx 20MB)
3. As imagens aparecem automaticamente na TV (Realtime)

### Ordenar imagens
- Arraste e solte as imagens na grade para reordenar
- A ordem é salva automaticamente

### Ativar/Desativar imagens
- Passe o mouse sobre a imagem → clique no ícone de olho
- Imagens inativas não aparecem no carrossel da TV

### Alterar data do evento
1. `/admin/settings`
2. Editar "Data do Evento"
3. Salvar → a contagem regressiva atualiza na TV em segundos

### Alterar intervalo do carrossel
1. `/admin/settings`
2. Ajustar o slider "Intervalo do Carrossel"
3. Padrão: 10 segundos

---

## 7. Trocar identidade visual (campanha futura)

O projeto foi construído para facilitar troca de campanha:

### Cores
Editar `tailwind.config.ts` → seção `colors.brand`:
```ts
brand: {
  green:  "#0dff51",   // Verde principal → trocar aqui
  cyan:   "#43c4c8",   // Ciano → trocar aqui
  dark:   "#014b3d",   // Verde escuro → trocar aqui
  yellow: "#ffdf02",   // Amarelo → trocar aqui
}
```

### Background da TV
Editar `app/globals.css` → classe `.astrocopa-bg`:
```css
.astrocopa-bg {
  background: linear-gradient(135deg, #NOVAcor1 0%, #NOVACORE2 100%);
}
```

### Logo
Substituir o componente `components/tv/TVLogo.tsx` por um `<Image>` com o novo SVG/PNG.

### Fonte
Editar `tailwind.config.ts` → `fontFamily.sora` → trocar para a nova fonte.
Atualizar o import no `app/globals.css`.

---

## 8. Estrutura de arquivos

```
astrocopa/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # Login Supabase Auth
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── media/page.tsx     # Upload e gerência de imagens
│   │   │   └── settings/page.tsx  # Configurações da campanha
│   │   └── layout.tsx             # Layout com sidebar
│   ├── tv/
│   │   ├── page.tsx               # Tela fullscreen da TV
│   │   └── layout.tsx
│   ├── globals.css                # Estilos globais + variáveis de marca
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Redireciona para /tv
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx       # Navegação lateral
│   │   ├── ImageUpload.tsx        # Dropzone de upload
│   │   └── MediaGrid.tsx          # Grid drag-and-drop
│   └── tv/
│       ├── TVCountdown.tsx        # Componente de contagem regressiva
│       ├── TVCarousel.tsx         # Carrossel de imagens
│       └── TVLogo.tsx             # Logo AstroCopa + Nova
├── hooks/
│   ├── useCampaign.ts             # Hook com Realtime
│   ├── useMedia.ts                # Hook com Realtime
│   └── useCountdown.ts            # Timer 1s
├── services/
│   ├── campaigns.ts               # CRUD campanhas
│   └── media.ts                   # Upload, delete, toggle, reorder
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   └── utils.ts
├── types/index.ts                 # TypeScript types
├── middleware.ts                  # Proteção de rotas /admin
├── supabase/
│   ├── schema.sql                 # Tabelas
│   ├── rls.sql                    # Row Level Security
│   └── storage.sql                # Storage policies
└── tailwind.config.ts             # Cores e tokens de marca
```

---

## 9. Suporte e manutenção

| Ação | Onde |
|---|---|
| Adicionar usuário admin | Supabase Dashboard → Authentication → Users |
| Ver logs de erro | Vercel Dashboard → Functions → Logs |
| Fazer backup do banco | Supabase Dashboard → Database → Backups |
| Monitorar storage | Supabase Dashboard → Storage → astrocopa-media |
| Alterar data | Admin → Configurações |
| Adicionar imagens | Admin → Mídias |
