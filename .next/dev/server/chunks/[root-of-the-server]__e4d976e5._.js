module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const globalForPrisma = globalThis;
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"]({
    connectionString: process.env.DATABASE_URL
});
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    adapter
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthToken",
    ()=>getAuthToken,
    "getUserFromToken",
    ()=>getUserFromToken,
    "hashPassword",
    ()=>hashPassword,
    "removeAuthCookie",
    ()=>removeAuthCookie,
    "setAuthCookie",
    ()=>setAuthCookie,
    "signToken",
    ()=>signToken,
    "verifyPassword",
    ()=>verifyPassword,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. ' + 'Please configure it before starting the application.');
}
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
}
async function verifyPassword(password, hashedPassword) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
}
async function signToken(payload) {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const jwtPayload = {
        userId: payload.userId,
        email: payload.email,
        perfil: payload.perfil
    };
    const token = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](jwtPayload).setProtectedHeader({
        alg: 'HS256'
    }).setExpirationTime('7d').sign(secret);
    return token;
}
async function verifyToken(token) {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
        return payload;
    } catch  {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });
}
async function removeAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('auth-token');
}
async function getAuthToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get('auth-token')?.value;
}
async function getUserFromToken(request) {
    let token = await getAuthToken();
    if (!token && request) {
        const authHeader = request.headers?.get?.('authorization') || request.headers?.['authorization'];
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
    }
    if (!token) return null;
    return verifyToken(token);
}
}),
"[project]/lib/recomendacoes-aluno.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcularTendencia",
    ()=>calcularTendencia,
    "gerarRecomendacoesAluno",
    ()=>gerarRecomendacoesAluno,
    "gerarResumoAmigavel",
    ()=>gerarResumoAmigavel
]);
const RECOMENDACOES_POR_DOMINIO = {
    'Fluência': [
        'Que tal experimentar jogos de palavras como caça-palavras ou palavras cruzadas? Eles ajudam a deixar as palavras mais "na ponta da língua".',
        'Contar histórias do seu dia para alguém próximo pode ser um ótimo exercício para a fluência verbal.',
        'Ouvir músicas e tentar cantar junto ajuda a exercitar a memória de palavras de forma leve e divertida.'
    ],
    'Cultura': [
        'Assistir a documentários ou programas sobre temas variados pode ampliar seu repertório de conhecimentos gerais.',
        'Conversar sobre notícias e acontecimentos com amigos ou familiares ajuda a manter a mente ativa e informada.',
        'Visitar museus, exposições ou eventos culturais pode ser uma forma prazerosa de enriquecer sua bagagem cultural.'
    ],
    'Atenção': [
        'Jogos como quebra-cabeças ou jogo dos 7 erros são ótimos para exercitar a atenção aos detalhes.',
        'Praticar atividades manuais como artesanato, jardinagem ou culinária exige foco e pode ser muito relaxante.',
        'Experimente fazer uma coisa de cada vez, prestando atenção total naquela atividade.'
    ],
    'Interpretação': [
        'Ler um pouco todos os dias, mesmo que sejam textos curtos, ajuda a manter a compreensão afiada.',
        'Discutir o que você leu ou assistiu com outras pessoas ajuda a organizar suas interpretações.',
        'Ouvir podcasts ou audiobooks e depois resumir mentalmente o que entendeu é um ótimo exercício.'
    ],
    'Auto-percepção': [
        'Anotar compromissos e tarefas em uma agenda pode ajudar a organizar a memória do dia a dia.',
        'Fazer pausas durante o dia para refletir sobre como você está se sentindo pode aumentar sua consciência sobre si mesmo.',
        'Pedir feedback de pessoas próximas sobre como você está pode trazer novas perspectivas sobre sua memória.'
    ]
};
function gerarRecomendacoesAluno(radar, quantidade = 3) {
    if (!radar || radar.length === 0) {
        return [];
    }
    const dominiosOrdenados = [
        ...radar
    ].sort((a, b)=>a.aluno - b.aluno);
    const dominiosMaisFracos = dominiosOrdenados.slice(0, quantidade);
    const recomendacoes = [];
    for (const dominio of dominiosMaisFracos){
        const recomendacoesDominio = RECOMENDACOES_POR_DOMINIO[dominio.dominio];
        if (recomendacoesDominio && recomendacoesDominio.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * recomendacoesDominio.length);
            recomendacoes.push({
                dominio: dominio.dominio,
                texto: recomendacoesDominio[indiceAleatorio]
            });
        }
    }
    return recomendacoes;
}
function gerarResumoAmigavel(evolucao, radar) {
    if (!evolucao || evolucao.length === 0) {
        return 'Ainda não temos avaliações suficientes para gerar um resumo. Continue participando das atividades!';
    }
    const primeiroScore = evolucao[0].score_total;
    const ultimoScore = evolucao[evolucao.length - 1].score_total;
    const diferenca = ultimoScore - primeiroScore;
    const dominiosFortes = radar.filter((d)=>d.aluno >= 7).map((d)=>d.dominio);
    let resumo = '';
    if (diferenca > 1) {
        resumo = 'Você está em uma trajetória positiva! ';
    } else if (diferenca < -1) {
        resumo = 'Mesmo com algumas oscilações recentes, lembre-se: oscilar é esperado e faz parte do processo. ';
    } else {
        resumo = 'Seu desempenho tem se mantido estável, o que também é um bom sinal. ';
    }
    if (dominiosFortes.length > 0) {
        if (dominiosFortes.length === 1) {
            resumo += `Você demonstra força especial em ${dominiosFortes[0]}. `;
        } else {
            const ultimos = dominiosFortes.pop();
            resumo += `Você demonstra força especial em ${dominiosFortes.join(', ')} e ${ultimos}. `;
        }
    }
    resumo += 'Continue participando regularmente das atividades – cada encontro é uma oportunidade de cuidar da sua mente!';
    return resumo;
}
function calcularTendencia(evolucao) {
    if (!evolucao || evolucao.length < 2) {
        return {
            direcao: 'estavel',
            variacao: 0,
            frase: 'Ainda estamos conhecendo sua trajetória.'
        };
    }
    const primeiroScore = evolucao[0].score_total;
    const ultimoScore = evolucao[evolucao.length - 1].score_total;
    const diferenca = ultimoScore - primeiroScore;
    if (diferenca > 0.5) {
        return {
            direcao: 'melhora',
            variacao: diferenca,
            frase: 'Você está evoluindo positivamente desde o início!'
        };
    } else if (diferenca < -0.5) {
        return {
            direcao: 'queda',
            variacao: diferenca,
            frase: 'Algumas oscilações são normais. O importante é manter a regularidade.'
        };
    } else {
        return {
            direcao: 'estavel',
            variacao: diferenca,
            frase: 'Seu desempenho tem se mantido consistente.'
        };
    }
}
}),
"[project]/app/api/aluno/meu-relatorio/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recomendacoes$2d$aluno$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/recomendacoes-aluno.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMonths$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/subMonths.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromToken"])();
        if (!user || user.perfil !== 'ALUNO') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autorizado'
            }, {
                status: 401
            });
        }
        const alunoBase = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].aluno.findFirst({
            where: {
                usuarioId: user.userId
            }
        });
        if (!alunoBase) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Perfil de aluno não encontrado'
            }, {
                status: 404
            });
        }
        const turma = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].turma.findUnique({
            where: {
                id: alunoBase.turmaId
            },
            include: {
                moderador: true
            }
        });
        const avaliacoes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findMany({
            where: {
                alunoId: alunoBase.id,
                status: 'CONCLUIDA'
            },
            orderBy: [
                {
                    ano_referencia: 'asc'
                },
                {
                    mes_referencia: 'asc'
                }
            ]
        });
        const evolucao = avaliacoes.map((av)=>({
                mes_ano: `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`,
                score_total: av.score_total,
                score_fluencia: av.score_fluencia_0a10,
                score_cultura: av.score_cultura_0a10,
                score_interpretacao: av.score_interpretacao_0a10,
                score_atencao: av.score_atencao_0a10,
                score_auto_percepcao: av.score_auto_percepcao_0a10
            }));
        const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1];
        const primeiraAvaliacao = avaliacoes[0];
        const radar = ultimaAvaliacao ? [
            {
                dominio: 'Fluência',
                aluno: ultimaAvaliacao.score_fluencia_0a10
            },
            {
                dominio: 'Cultura',
                aluno: ultimaAvaliacao.score_cultura_0a10
            },
            {
                dominio: 'Interpretação',
                aluno: ultimaAvaliacao.score_interpretacao_0a10
            },
            {
                dominio: 'Atenção',
                aluno: ultimaAvaliacao.score_atencao_0a10
            },
            {
                dominio: 'Auto-percepção',
                aluno: ultimaAvaliacao.score_auto_percepcao_0a10
            }
        ] : [];
        let periodoInicio = '';
        let periodoFim = '';
        if (primeiraAvaliacao && ultimaAvaliacao) {
            const mesesNome = [
                '',
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez'
            ];
            periodoInicio = `${mesesNome[primeiraAvaliacao.mes_referencia]}/${primeiraAvaliacao.ano_referencia}`;
            periodoFim = `${mesesNome[ultimaAvaliacao.mes_referencia]}/${ultimaAvaliacao.ano_referencia}`;
        }
        const agora = new Date();
        const seisMesesAtras = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMonths$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMonths"])(agora, 6);
        const presencasData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$queryRaw`
      SELECT id, presente FROM "Presenca" 
      WHERE "alunoId" = ${alunoBase.id} 
      AND data >= ${seisMesesAtras} 
      AND data <= ${agora}
    `;
        const totalEncontros = presencasData.length;
        const presencasConfirmadas = presencasData.filter((p)=>p.presente).length;
        const percentualPresenca = totalEncontros > 0 ? Math.round(presencasConfirmadas / totalEncontros * 100) : 0;
        let statusPresenca;
        if (percentualPresenca >= 75) {
            statusPresenca = 'verde';
        } else if (percentualPresenca >= 50) {
            statusPresenca = 'amarelo';
        } else {
            statusPresenca = 'vermelho';
        }
        const tendencia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recomendacoes$2d$aluno$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularTendencia"])(evolucao);
        const resumo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recomendacoes$2d$aluno$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gerarResumoAmigavel"])(evolucao, radar);
        const recomendacoes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recomendacoes$2d$aluno$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gerarRecomendacoesAluno"])(radar, 3);
        const horarioTurma = turma ? `${turma.nome_turma} – ${turma.dia_semana}, ${turma.horario}` : 'Turma não definida';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            aluno: {
                id: alunoBase.id,
                nome: alunoBase.nome,
                turma: horarioTurma,
                moderadora: turma?.moderador?.nome || 'Moderadora'
            },
            periodo: {
                inicio: periodoInicio,
                fim: periodoFim
            },
            evolucao,
            radar,
            tendencia: {
                direcao: tendencia.direcao,
                variacao: tendencia.variacao,
                frase: tendencia.frase,
                scoreAtual: ultimaAvaliacao?.score_total || 0
            },
            presenca: {
                participou: presencasConfirmadas,
                total: totalEncontros,
                percentual: percentualPresenca,
                status: statusPresenca
            },
            resumo,
            recomendacoes
        });
    } catch (error) {
        console.error('Erro ao gerar relatório do aluno:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e4d976e5._.js.map