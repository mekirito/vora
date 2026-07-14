export interface SeasonPrize {
  place: 1 | 2 | 3;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface BillboardMilestone {
  id: string;
  amount: number;
  amountLabel: string;
  title: string;
  reward: string;
  image?: string;
  imageAlt?: string;
}

export interface RecruitBenefit {
  title: string;
  body: string;
}

export interface RecruitStep {
  n: string;
  title: string;
  body: string;
}

export interface EventPerk {
  title: string;
  body: string;
}

export const EVENT_INTRO = {
  eyebrow: "Eventos",
  title: "A vitrine também acontece ao vivo.",
  body: "A VORA aposta forte em companhia para eventos — galas, estreias, corporativos, arte e nightlife com critério. É presença, não catálogo. E quem está na seleção tem condições especiais para esse circuito.",
};

export const EVENT_PERKS: EventPerk[] = [
  {
    title: "Agenda curada",
    body: "Convites e oportunidades alinhadas ao seu estilo — sem spam de any party.",
  },
  {
    title: "Ticket de evento elevado",
    body: "Companhia para ocasiões formais e sociais com valor de experiência compatível com a linha premium.",
  },
  {
    title: "Briefing claro",
    body: "Dress code, duração, região e combinados definidos antes do aceite. Você decide com informação.",
  },
  {
    title: "Prioridade na vitrine de eventos",
    body: "Perfis aprovados para eventos ganham destaque quando o cliente busca companhia para a noite certa.",
  },
  {
    title: "Deslocamento em ocasiões selecionadas",
    body: "Para eventos elegíveis, a plataforma prevê apoio de transfer — mais foco na presença, menos fricção.",
  },
  {
    title: "Apoio no dia",
    body: "Canal de suporte ativo durante o horário do evento. Segurança sem burocracia teatral.",
  },
  {
    title: "Conta na temporada",
    body: "Faturamento de eventos entra no ranking semestral e nos billboards de carreira — presença ao vivo também sobe.",
  },
  {
    title: "Respeito aos limites",
    body: "Eventos são experiências sociais adultas. Combinados claros, zero pressão por além do acordado.",
  },
];

export const SEASON_PRIZES: SeasonPrize[] = [
  {
    place: 1,
    label: "1º lugar",
    title: "BYD Song Plus",
    description:
      "SUV híbrido premium para quem fecha a temporada no topo do faturamento.",
    image: "/recruit/song-plus.jpg",
    imageAlt: "SUV híbrido premium — prêmio do primeiro lugar da temporada VORA",
  },
  {
    place: 2,
    label: "2º lugar",
    title: "Cancún · Hard Rock",
    description:
      "Viagem a Cancún com hospedagem em resort premium Hard Rock.",
    image: "/recruit/cancun-hard-rock.jpg",
    imageAlt: "Resort tropical premium em Cancún — prêmio do segundo lugar",
  },
  {
    place: 3,
    label: "3º lugar",
    title: "R$ 50.000",
    description:
      "Premiação em dinheiro para o terceiro maior faturamento do semestre.",
    image: "/recruit/premio-50k.jpg",
    imageAlt: "Premiação editorial de cinquenta mil reais — terceiro lugar",
  },
];

export const BILLBOARDS: BillboardMilestone[] = [
  {
    id: "bb-10k",
    amount: 10_000,
    amountLabel: "R$ 10 mil",
    title: "Billboard 10k",
    reward: "Pulseira exclusiva VORA",
    image: "/recruit/pulseira-vora.jpg",
    imageAlt: "Pulseira exclusiva VORA — marco de dez mil reais",
  },
  {
    id: "bb-100k",
    amount: 100_000,
    amountLabel: "R$ 100 mil",
    title: "Billboard 100k",
    reward: "Kit de reconhecimento editorial + menção na vitrine",
  },
  {
    id: "bb-500k",
    amount: 500_000,
    amountLabel: "R$ 500 mil",
    title: "Billboard 500k",
    reward: "Upgrade de presença + brinde premium da temporada",
  },
  {
    id: "bb-1m",
    amount: 1_000_000,
    amountLabel: "R$ 1 milhão",
    title: "Billboard 1M",
    reward: "Status VORA Legend + reconhecimento máximo na vitrine",
  },
];

export const RECRUIT_BENEFITS: RecruitBenefit[] = [
  {
    title: "Confiança e curadoria",
    body: "A VORA seleciona com intenção. A vitrine reflete capricho — não volume.",
  },
  {
    title: "Presença premium",
    body: "Ambiente alinhado a quem valoriza discrição, estilo e clareza nos combinados.",
  },
  {
    title: "Clientes verificados",
    body: "Identidade confirmada do outro lado. Menos ruído, mais convites qualificados.",
  },
  {
    title: "Sua conta verificada",
    body: "Fotos e identidade validadas — status que fortalece a confiança na descoberta.",
  },
  {
    title: "Pagamento antes do encontro",
    body: "O Pix é confirmado antes do chat e do início. Você começa com segurança financeira.",
  },
  {
    title: "Suporte presente",
    body: "Central de segurança e suporte durante a reserva confirmada — sem burocracia teatral.",
  },
  {
    title: "Uma opção por vez",
    body: "Do lado do cliente não há catálogo infinito. Os convites chegam com mais intenção.",
  },
  {
    title: "Privacidade por padrão",
    body: "Você está no controle do que compartilha. Discrição como regra, não como extra.",
  },
];

export const RECRUIT_STEPS: RecruitStep[] = [
  {
    n: "01",
    title: "Candidate-se",
    body: "Conte quem você é e por que a VORA faz sentido para a sua presença.",
  },
  {
    n: "02",
    title: "Verificação",
    body: "Identidade e fotos passam por validação segura — padrão da plataforma.",
  },
  {
    n: "03",
    title: "Curadoria",
    body: "O perfil é aprovado com critério. Entrar na vitrine é ser selecionada.",
  },
  {
    n: "04",
    title: "Temporada e eventos",
    body: "Atue na descoberta, no circuito de eventos, acumule billboards e dispute o ranking semestral.",
  },
];

export const SEASON_RULES = {
  periodLabel: "Temporada de 6 meses",
  metricLabel: "Faturamento na VORA",
  summary:
    "A cada semestre, o ranking considera apenas o faturamento gerado na plataforma no período. As três primeiras posições recebem os prêmios da temporada.",
  disclaimer:
    "Protótipo — prêmios e regras são ilustrativos e sujeitos a regulamento oficial da temporada.",
};

export const APPLICATIONS_STORAGE_KEY = "vora-provider-applications";
