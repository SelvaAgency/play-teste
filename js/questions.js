// Versão curta do Diagnóstico Trilha IA Play (v3 FINAL).
// Uma questão por competência, sempre a de nível Intermediário: cobre os 9 módulos
// e dá um sinal de base sem pretender diagnosticar nível. O nível
// (Básico / Intermediário / Avançado) só sai do diagnóstico completo, com 27 questões.
// Os textos vêm da planilha "Diagnóstico" e da aba "Feedbacks (import)", sem alteração.

const BASE_AULA = "https://app.scaffoldplay.com.br/class/link/";

window.QUESTIONS = [
  {
    n: 2,
    cod: "C1",
    modulo: "M1",
    competencia: "Fundamentos de IA",
    pergunta: "O diretor comercial diz: \"quero usar IA para vender mais\". Qual reformulação transforma isso em algo testável?",
    correta: "A",
    alternativas: {
      A: {
        texto: "Se priorizarmos os leads com maior probabilidade de fechamento, o ciclo de vendas encurta — e isso pode ser testado em uma carteira antes de escalar.",
        feedback: "Isso. Tem relação causal proposta, resultado esperado e recorte de teste — os três elementos que tornam uma hipótese verificável antes de virar projeto."
      },
      B: {
        texto: "Vamos implantar um chatbot de vendas no site em 60 dias.",
        feedback: "Isso é um plano de entrega, não uma hipótese. Define prazo e ferramenta, mas não diz o que se espera que mude. Se o chatbot for ao ar em 60 dias e as vendas não subirem, ninguém consegue explicar o porquê.",
        aula: "M1 · Vocabulário & Papel", slug: "vocabulario-papel"
      },
      C: {
        texto: "Precisamos de um modelo generativo treinado com nosso histórico comercial.",
        feedback: "Você partiu para a tecnologia sem definir o que quer provar. Treinar um modelo com o histórico comercial pode ser o caminho, mas sem hipótese não existe critério para dizer se deu certo.",
        aula: "M1 · Vocabulário & Papel", slug: "vocabulario-papel"
      },
      D: {
        texto: "Vamos comparar as ferramentas de IA para vendas disponíveis no mercado.",
        feedback: "Comparar ferramentas é pesquisa de mercado, etapa que vem depois de saber o que precisa ser resolvido. Começar por aqui costuma levar à ferramenta mais completa em vez da adequada.",
        aula: "M1 · Importância & Tipos de IA", slug: "importancia-tipos-de-ia"
      }
    }
  },
  {
    n: 5,
    cod: "C2",
    modulo: "M2",
    competencia: "Priorização de casos de uso",
    pergunta: "Você levantou 6 oportunidades: duas de alto valor e alta complexidade, uma de valor médio e complexidade baixa, três de valor baixo. É o primeiro projeto de IA da empresa. Por onde começar?",
    correta: "D",
    alternativas: {
      A: {
        texto: "Pela de maior valor, mesmo com alta complexidade, para maximizar o retorno do trimestre.",
        feedback: "A lógica de maximizar retorno faz sentido, mas alto valor com alta complexidade no primeiro projeto costuma consumir o crédito antes de entregar. Quando atrasa, e projetos complexos atrasam, você perde o caso e a confiança para o próximo.",
        aula: "M2 · Valor além do custo e matriz P/M/G", slug: "valor-alem-do-custo-e-matriz-p-m-g-380252"
      },
      B: {
        texto: "Pelas três de valor baixo, porque são rápidas e geram volume de entregas.",
        feedback: "Volume de entregas não é o mesmo que valor entregue. Três casos de baixo valor consomem a mesma energia de coordenação e produzem um resultado que ninguém na diretoria vai lembrar no trimestre seguinte.",
        aula: "M2 · Valor além do custo e matriz P/M/G", slug: "valor-alem-do-custo-e-matriz-p-m-g-380252"
      },
      C: {
        texto: "Por nenhuma: esperar a empresa amadurecer antes de rodar qualquer piloto.",
        feedback: "Esperar a empresa amadurecer é um paradoxo: maturidade em IA se constrói rodando piloto, não antes dele. O que se faz é reduzir o tamanho do primeiro passo, não adiá-lo.",
        aula: "M2 · Avaliação de maturidade e quick wins", slug: "avaliacao-de-maturidade-e-quick-wins"
      },
      D: {
        texto: "Pela de valor médio e complexidade baixa, para comprovar valor e ganhar maturidade antes de assumir risco maior.",
        feedback: "Certo. No primeiro ciclo, o objetivo é aprender e provar valor com risco baixo — e é o resultado desse caso que libera a permissão para os difíceis."
      }
    }
  },
  {
    n: 8,
    cod: "C3",
    modulo: "M3",
    competencia: "Definição de valor e KPIs",
    pergunta: "Um sistema vai classificar e-mails de clientes e separar reclamações graves para tratamento prioritário. Deixar passar uma reclamação grave é muito mais custoso que sinalizar uma comum por engano. Qual métrica deve guiar o ajuste?",
    correta: "D",
    alternativas: {
      A: {
        texto: "Acurácia geral, por ser a métrica mais completa.",
        feedback: "Acurácia parece a métrica mais completa, mas dilui o erro que importa. Se 95% dos e-mails são comuns, um modelo que ignora todas as reclamações graves ainda acerta 95%.",
        aula: "M3 · Procedência do dado e escolha da métrica", slug: "procedencia-do-dado-e-escolha-da-metrica"
      },
      B: {
        texto: "Precisão, para evitar sinalizar reclamações comuns por engano.",
        feedback: "Precisão é a métrica certa para o problema inverso, quando o custo está em sinalizar demais. Aqui você otimizaria o erro barato: sinalizar uma reclamação comum gera retrabalho, deixar passar uma grave gera crise.",
        aula: "M3 · Procedência do dado e escolha da métrica", slug: "procedencia-do-dado-e-escolha-da-metrica"
      },
      C: {
        texto: "Latência, para garantir resposta rápida ao cliente.",
        feedback: "Latência mede operação, não qualidade da classificação. Um modelo rápido e errado responde rápido a coisa errada. Ela entra depois, quando o sistema já está em produção.",
        aula: "M7 · Operação Inicial & Roteiro 60-90d", slug: "operacao-inicial-roteiro-60-90d"
      },
      D: {
        texto: "Recall, para minimizar reclamações graves que passam sem sinalização.",
        feedback: "Isso. Você identificou que o erro caro é deixar passar, e recall mede exatamente isso. O passo seguinte é definir qual nível de recall é aceitável e o que acontece quando ele é rompido."
      }
    }
  },
  {
    n: 11,
    cod: "C4",
    modulo: "M4",
    competencia: "Escolha de abordagem tecnológica",
    pergunta: "Um processo exige interpretar documentos internos extensos e decidir em várias etapas com base neles. Qual abordagem tende a ser mais adequada?",
    correta: "D",
    alternativas: {
      A: {
        texto: "Uma automação por regras fixas aplicadas ao texto dos documentos.",
        feedback: "Regra fixa funciona enquanto os documentos forem previsíveis. No primeiro que fugir do padrão ela falha em silêncio, e documento interno extenso raramente segue padrão.",
        aula: "M4 · Abordagens e Restrições", slug: "abordagens-e-restricoes"
      },
      B: {
        texto: "Um modelo preditivo treinado no histórico de decisões anteriores.",
        feedback: "Modelo preditivo aprende a repetir o padrão das decisões passadas, mas não lê o documento novo nem explica por que decidiu. Aqui interpretar o conteúdo é o trabalho, não prever.",
        aula: "M4 · Abordagens e Restrições", slug: "abordagens-e-restricoes"
      },
      C: {
        texto: "Uma planilha com fórmulas de busca e classificação.",
        feedback: "Planilha resolve busca em dado estruturado. Documento extenso em linguagem natural não é dado estruturado, e a fórmula não entende que dois trechos dizem a mesma coisa com palavras diferentes.",
        aula: "M4 · Automação & Agentes (panorama)", slug: "automacao-agentes-panorama"
      },
      D: {
        texto: "Um agente com RAG, que consulta os documentos antes de responder e decide em etapas.",
        feedback: "Certo. Conteúdo não estruturado somado à decisão em várias etapas pede recuperar contexto e raciocinar sobre ele — que é o que um agente com RAG faz."
      }
    }
  },
  {
    n: 14,
    cod: "C5",
    modulo: "M5",
    competencia: "Prototipagem de agentes",
    pergunta: "Ao construir o primeiro protótipo de um agente, qual deve ser o foco?",
    correta: "A",
    alternativas: {
      A: {
        texto: "Validar a hipótese central no menor escopo possível, com um usuário real e um output definido.",
        feedback: "Certo. Um usuário real e um output definido bastam para aprender o que importa — e é esse aprendizado que orienta o escopo seguinte."
      },
      B: {
        texto: "Cobrir todos os casos de uso previstos antes do primeiro teste.",
        feedback: "Cobrir todos os casos antes de testar é o padrão do projeto que não sai do piloto: você descobre o que estava errado depois de já ter construído tudo.",
        aula: "M5 · Construir MVP do Agente", slug: "construir-mvp-do-agente"
      },
      C: {
        texto: "Montar a infraestrutura definitiva antes de expor o fluxo a alguém.",
        feedback: "Infraestrutura definitiva antes de validar é investir no encanamento de uma casa cuja planta ainda pode mudar.",
        aula: "M5 · Construir MVP do Agente", slug: "construir-mvp-do-agente"
      },
      D: {
        texto: "Aguardar a aprovação do orçamento completo do projeto.",
        feedback: "Esperar o orçamento completo inverte a ordem: o protótipo é justamente o que dá argumento para pedir orçamento.",
        aula: "M2 · Tomar decisão de priorização inicial", slug: "tomar-decisao-de-priorizacao-inicial"
      }
    }
  },
  {
    n: 17,
    cod: "C6",
    modulo: "M6",
    competencia: "Validação e guardrails",
    pergunta: "Em que situações um agente deve obrigatoriamente escalar a decisão para um humano?",
    correta: "B",
    alternativas: {
      A: {
        texto: "Quando o volume de solicitações excede a capacidade de processamento.",
        feedback: "Volume é problema de capacidade, resolvido com infraestrutura. Escalar por volume manda para o humano justamente os casos mais banais.",
        aula: "M6 · Persona e Jornada", slug: "persona-e-jornada"
      },
      B: {
        texto: "Quando a decisão tem impacto financeiro, jurídico ou sobre pessoas, ou quando a confiança do agente na própria resposta é baixa.",
        feedback: "Certo. O gatilho é o risco da decisão somado à incerteza do agente — e os dois precisam estar declarados antes, não julgados caso a caso."
      },
      C: {
        texto: "Sempre, para toda resposta gerada, garantindo revisão integral.",
        feedback: "Revisar tudo elimina o ganho que justificou o projeto — e, na prática, revisão integral vira carimbo depois da segunda semana.",
        aula: "M6 · Conexão com Sistemas & Confiança", slug: "conexao-com-sistemas-confianca"
      },
      D: {
        texto: "Apenas quando o usuário pede explicitamente para falar com um atendente.",
        feedback: "Deixar o escalonamento por conta do usuário transfere para ele a responsabilidade de perceber que a resposta está errada. Quem não sabe o suficiente para desconfiar é quem mais precisa de proteção.",
        aula: "M6 · Conexão com Sistemas & Confiança", slug: "conexao-com-sistemas-confianca"
      }
    }
  },
  {
    n: 20,
    cod: "C7",
    modulo: "M7",
    competencia: "Dados e indicadores de operação",
    pergunta: "Você acompanha três indicadores semanais de um agente em operação. Em uma semana, um deles cai abaixo da meta. Qual é a leitura mais adequada?",
    correta: "C",
    alternativas: {
      A: {
        texto: "Comparar o valor com a meta e executar o ajuste imediatamente.",
        feedback: "Agir na primeira semana abaixo da meta parece diligência, mas você ainda não sabe se é variação normal. E depois do ajuste fica impossível saber o que causou a mudança.",
        aula: "M7 · Operação Inicial & Roteiro 60-90d", slug: "operacao-inicial-roteiro-60-90d"
      },
      B: {
        texto: "Aguardar o fim do trimestre para ter volume suficiente de dados.",
        feedback: "Esperar o trimestre é o extremo oposto de ajustar na primeira semana, mas igualmente ruim: quando o dado chegar, o problema já custou três meses. O intervalo útil está no meio.",
        aula: "M7 · Operação Inicial & Roteiro 60-90d", slug: "operacao-inicial-roteiro-60-90d"
      },
      C: {
        texto: "Observar a tendência das últimas semanas antes de agir, em vez de reagir ao valor absoluto de uma semana.",
        feedback: "Certo. Em operação, tendência informa mais que ponto isolado — e ajustar em cima de ruído destrói a leitura da semana seguinte."
      },
      D: {
        texto: "Priorizar sempre o indicador que estiver mais distante da meta.",
        feedback: "Distância da meta não indica urgência. Um indicador cronicamente abaixo pode ter meta mal calibrada, enquanto outro que começou a cair nesta semana é o que está mudando.",
        aula: "M3 · Métricas técnicas e de negócio", slug: "metricas-tecnicas-e-de-negocio"
      }
    }
  },
  {
    n: 23,
    cod: "C8",
    modulo: "M8",
    competencia: "Governança e IA responsável",
    pergunta: "Sua empresa vai usar dados históricos de contratação para treinar um modelo de triagem de candidatos. Como reduzir o risco de viés?",
    correta: "B",
    alternativas: {
      A: {
        texto: "Remover as variáveis de gênero e raça do modelo, o que elimina o viés.",
        feedback: "É a intuição mais comum e a mais perigosa, porque dá sensação de resolvido. O viés sobrevive em variáveis correlacionadas: CEP, escola, tempo de carreira.",
        aula: "M8 · IA explicável e mitigação de vieses", slug: "ia-explicavel-e-mitigacao-de-vieses"
      },
      B: {
        texto: "Verificar se a base reflete desigualdades passadas e comparar o desempenho do modelo entre grupos antes de usá-lo.",
        feedback: "Certo. O viés está no histórico, não na variável — e só aparece quando você compara o desempenho do modelo entre grupos."
      },
      C: {
        texto: "Aumentar o volume de dados de treino até o viés se diluir.",
        feedback: "Mais dados do mesmo histórico reforçam o padrão em vez de diluí-lo. Volume não corrige desigualdade que já está no dado.",
        aula: "M3 · Do dado bruto à decisão inteligente", slug: "do-dado-bruto-a-decisao-inteligente"
      },
      D: {
        texto: "Confiar na acurácia geral, que indica se o modelo está sendo justo.",
        feedback: "Acurácia geral pode ser alta justamente porque o modelo acerta no grupo majoritário e erra no minoritário. Ela esconde exatamente o que você quer detectar.",
        aula: "M3 · Métricas técnicas e de negócio", slug: "metricas-tecnicas-e-de-negocio"
      }
    }
  },
  {
    n: 26,
    cod: "C9",
    modulo: "M9",
    competencia: "Liderança e adoção",
    pergunta: "Uma área resiste a usar um agente já validado, por receio de que ele substitua pessoas. Qual abordagem tem mais chance de destravar a adoção?",
    correta: "C",
    alternativas: {
      A: {
        texto: "Determinar o uso obrigatório e acompanhar a adesão por indicador.",
        feedback: "Obrigatoriedade produz adesão de fachada: o indicador sobe, o uso real não. E confirma para a área que a ferramenta é algo feito com ela, não para ela.",
        aula: "M9 · Negócio como protagonista da agenda", slug: "negocio-como-protagonista-da-agenda"
      },
      B: {
        texto: "Garantir formalmente que nenhuma função será alterada por causa do projeto.",
        feedback: "É uma promessa que a liderança normalmente não pode cumprir. Quando alguma função mudar, e vai mudar, você perde a confiança para todos os projetos seguintes.",
        aula: "M8 · Ética, transparência e SWOT de ética", slug: "etica-transparencia-e-swot-de-etica"
      },
      C: {
        texto: "Mostrar o ganho de tempo da própria equipe em tarefas que ela já considera desgastantes, mantendo a decisão final com os analistas.",
        feedback: "Certo. Resistência por medo se trabalha com ganho concreto para quem usa e com o humano preservado na decisão."
      },
      D: {
        texto: "Adiar o projeto até que a área solicite espontaneamente a ferramenta.",
        feedback: "Esperar demanda espontânea significa esperar indefinidamente. Adoção é responsabilidade do líder, não da área que resiste.",
        aula: "M9 · Negócio como protagonista da agenda", slug: "negocio-como-protagonista-da-agenda"
      }
    }
  }
];

window.QUESTIONS.forEach(q => {
  Object.values(q.alternativas).forEach(a => {
    if (a.slug) a.url = BASE_AULA + a.slug;
  });
});
