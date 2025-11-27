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
    const token = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
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
"[project]/lib/resumo-analitico.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcularVariacoes",
    ()=>calcularVariacoes,
    "gerarResumoAnalitico",
    ()=>gerarResumoAnalitico
]);
function classificarVariacao(variacao) {
    if (variacao > 1.0) return 'melhora';
    if (variacao < -1.0) return 'queda';
    return 'estavel';
}
function formatarListaDominios(dominios) {
    if (dominios.length === 0) return '';
    if (dominios.length === 1) return dominios[0];
    if (dominios.length === 2) return `${dominios[0]} e ${dominios[1]}`;
    const ultimo = dominios.pop();
    return `${dominios.join(', ')} e ${ultimo}`;
}
function gerarResumoAnalitico({ evolucao, variacoes, presencas, periodoMeses }) {
    if (evolucao.length === 0) {
        return 'Ainda não há avaliações suficientes para gerar um resumo analítico.';
    }
    const partes = [];
    const periodoTexto = periodoMeses === 3 ? 'nos últimos 3 meses' : periodoMeses === 6 ? 'nos últimos 6 meses' : periodoMeses === 12 ? 'no último ano' : 'no período analisado';
    const melhorias = variacoes.filter((v)=>v.tendencia === 'melhora').map((v)=>v.dominio);
    const quedas = variacoes.filter((v)=>v.tendencia === 'queda').map((v)=>v.dominio);
    const estaveis = variacoes.filter((v)=>v.tendencia === 'estavel').map((v)=>v.dominio);
    if (melhorias.length > 0) {
        const dominiosMelhora = formatarListaDominios([
            ...melhorias
        ]);
        partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, o aluno apresentou melhora consistente em ${dominiosMelhora}`);
    }
    if (estaveis.length > 0 && partes.length > 0) {
        const dominiosEstaveis = formatarListaDominios([
            ...estaveis
        ]);
        partes.push(`mantendo estabilidade em ${dominiosEstaveis}`);
    } else if (estaveis.length > 0) {
        const dominiosEstaveis = formatarListaDominios([
            ...estaveis
        ]);
        partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, o aluno manteve desempenho estável em ${dominiosEstaveis}`);
    }
    if (quedas.length > 0) {
        const dominiosQueda = formatarListaDominios([
            ...quedas
        ]);
        if (partes.length > 0) {
            partes.push(`Observa-se leve queda em ${dominiosQueda}`);
        } else {
            partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, observa-se queda no desempenho em ${dominiosQueda}`);
        }
    }
    if (presencas && presencas.length > 0) {
        const mediaPresenca = presencas.reduce((sum, p)=>sum + p.percentual, 0) / presencas.length;
        if (mediaPresenca < 70 && quedas.length > 0) {
            partes.push('coincidindo com redução na frequência às sessões no período');
        } else if (mediaPresenca >= 85) {
            partes.push('O aluno demonstrou excelente engajamento, com presença regular nas sessões');
        } else if (mediaPresenca < 60) {
            partes.push('A frequência reduzida às sessões pode estar impactando o desenvolvimento cognitivo');
        }
    }
    if (partes.length === 0) {
        return 'O aluno apresenta desempenho dentro dos parâmetros esperados, sem variações significativas no período.';
    }
    let texto = partes.join('. ');
    if (!texto.endsWith('.')) {
        texto += '.';
    }
    return texto;
}
function calcularVariacoes(evolucao, mesAtual) {
    if (evolucao.length < 2) {
        return [];
    }
    const ultimo = evolucao[evolucao.length - 1];
    const indicePeriodo = Math.max(0, evolucao.length - mesAtual - 1);
    const referencia = evolucao[indicePeriodo] || evolucao[0];
    const dominios = [
        {
            key: 'score_fluencia',
            nome: 'Fluência'
        },
        {
            key: 'score_cultura',
            nome: 'Cultura'
        },
        {
            key: 'score_interpretacao',
            nome: 'Interpretação'
        },
        {
            key: 'score_atencao',
            nome: 'Atenção'
        },
        {
            key: 'score_auto_percepcao',
            nome: 'Auto-percepção'
        },
        {
            key: 'score_total',
            nome: 'Total'
        }
    ];
    return dominios.map((d)=>{
        const atual = ultimo[d.key] || 0;
        const anterior = referencia[d.key] || 0;
        const variacao = atual - anterior;
        return {
            dominio: d.nome,
            variacao,
            tendencia: classificarVariacao(variacao)
        };
    });
}
}),
"[project]/app/api/moderador/relatorios/aluno/[alunoId]/anual/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$resumo$2d$analitico$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/resumo-analitico.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function GET(request, { params }) {
    try {
        const { alunoId } = await params;
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromToken"])();
        if (!user || user.perfil !== 'MODERADOR') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autorizado'
            }, {
                status: 401
            });
        }
        const aluno = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].aluno.findFirst({
            where: {
                id: alunoId,
                turma: {
                    moderadorId: user.userId
                }
            },
            include: {
                turma: true
            }
        });
        if (!aluno) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Aluno não encontrado'
            }, {
                status: 404
            });
        }
        const { searchParams } = new URL(request.url);
        const ano = parseInt(searchParams.get('ano') || new Date().getFullYear().toString());
        const avaliacoes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findMany({
            where: {
                alunoId,
                ano_referencia: ano,
                status: 'CONCLUIDA'
            },
            orderBy: {
                mes_referencia: 'asc'
            }
        });
        const trimestres = [
            {
                nome: 'T1',
                meses: [
                    1,
                    2,
                    3
                ]
            },
            {
                nome: 'T2',
                meses: [
                    4,
                    5,
                    6
                ]
            },
            {
                nome: 'T3',
                meses: [
                    7,
                    8,
                    9
                ]
            },
            {
                nome: 'T4',
                meses: [
                    10,
                    11,
                    12
                ]
            }
        ];
        const mediasTrimestrais = trimestres.map((tri)=>{
            const avsTri = avaliacoes.filter((a)=>tri.meses.includes(a.mes_referencia));
            if (avsTri.length === 0) {
                return {
                    trimestre: tri.nome,
                    dados: null
                };
            }
            return {
                trimestre: tri.nome,
                dados: {
                    score_total: avsTri.reduce((s, a)=>s + a.score_total, 0) / avsTri.length,
                    score_fluencia: avsTri.reduce((s, a)=>s + a.score_fluencia_0a10, 0) / avsTri.length,
                    score_cultura: avsTri.reduce((s, a)=>s + a.score_cultura_0a10, 0) / avsTri.length,
                    score_interpretacao: avsTri.reduce((s, a)=>s + a.score_interpretacao_0a10, 0) / avsTri.length,
                    score_atencao: avsTri.reduce((s, a)=>s + a.score_atencao_0a10, 0) / avsTri.length,
                    score_auto_percepcao: avsTri.reduce((s, a)=>s + a.score_auto_percepcao_0a10, 0) / avsTri.length
                }
            };
        });
        const evolucaoTrimestral = mediasTrimestrais.filter((t)=>t.dados).map((t)=>({
                mes_ano: t.trimestre,
                ...t.dados
            }));
        let mediaAnual = null;
        if (avaliacoes.length > 0) {
            mediaAnual = {
                fluencia: avaliacoes.reduce((s, a)=>s + a.score_fluencia_0a10, 0) / avaliacoes.length,
                cultura: avaliacoes.reduce((s, a)=>s + a.score_cultura_0a10, 0) / avaliacoes.length,
                interpretacao: avaliacoes.reduce((s, a)=>s + a.score_interpretacao_0a10, 0) / avaliacoes.length,
                atencao: avaliacoes.reduce((s, a)=>s + a.score_atencao_0a10, 0) / avaliacoes.length,
                auto_percepcao: avaliacoes.reduce((s, a)=>s + a.score_auto_percepcao_0a10, 0) / avaliacoes.length
            };
        }
        const radarAnual = mediaAnual ? [
            {
                dominio: 'Fluência',
                aluno: mediaAnual.fluencia
            },
            {
                dominio: 'Cultura',
                aluno: mediaAnual.cultura
            },
            {
                dominio: 'Interpretação',
                aluno: mediaAnual.interpretacao
            },
            {
                dominio: 'Atenção',
                aluno: mediaAnual.atencao
            },
            {
                dominio: 'Auto-percepção',
                aluno: mediaAnual.auto_percepcao
            }
        ] : [];
        const presencas = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].presenca.findMany({
            where: {
                alunoId,
                data: {
                    gte: new Date(ano, 0, 1),
                    lte: new Date(ano, 11, 31)
                }
            }
        });
        const totalPresencas = presencas.filter((p)=>p.presente).length;
        const totalSessoes = presencas.length;
        const presencaMediaAnual = totalSessoes > 0 ? totalPresencas / totalSessoes * 100 : 0;
        const evolucaoParaResumo = avaliacoes.map((av)=>({
                score_total: av.score_total,
                score_fluencia: av.score_fluencia_0a10,
                score_cultura: av.score_cultura_0a10,
                score_interpretacao: av.score_interpretacao_0a10,
                score_atencao: av.score_atencao_0a10,
                score_auto_percepcao: av.score_auto_percepcao_0a10
            }));
        const variacoes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$resumo$2d$analitico$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularVariacoes"])(evolucaoParaResumo, 12);
        const resumoTexto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$resumo$2d$analitico$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gerarResumoAnalitico"])({
            evolucao: evolucaoParaResumo,
            variacoes,
            presencas: [
                {
                    percentual: presencaMediaAnual
                }
            ],
            periodoMeses: 12
        });
        const anosDisponiveis = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findMany({
            where: {
                alunoId,
                status: 'CONCLUIDA'
            },
            select: {
                ano_referencia: true
            },
            distinct: [
                'ano_referencia'
            ],
            orderBy: {
                ano_referencia: 'desc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            aluno: {
                id: aluno.id,
                nome: aluno.nome,
                turma: aluno.turma.nome_turma
            },
            ano,
            anosDisponiveis: anosDisponiveis.map((a)=>a.ano_referencia),
            evolucaoTrimestral,
            radarAnual,
            presencaMediaAnual,
            resumoTexto
        });
    } catch (error) {
        console.error('Erro ao gerar relatório anual:', error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__d0e274d6._.js.map