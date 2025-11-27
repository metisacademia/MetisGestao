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
"[project]/lib/pontuacao.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcularPontuacaoItem",
    ()=>calcularPontuacaoItem,
    "calcularPontuacaoMaximaItem",
    ()=>calcularPontuacaoMaximaItem,
    "calcularScoreTotal",
    ()=>calcularScoreTotal,
    "calcularScoresPorDominio",
    ()=>calcularScoresPorDominio
]);
function calcularPontuacaoMaximaItem(regra_pontuacao_json) {
    try {
        const regra = JSON.parse(regra_pontuacao_json);
        switch(regra.tipo){
            case 'faixas':
                {
                    return Math.max(...regra.faixas.map((f)=>f.pontos));
                }
            case 'sim_nao':
                {
                    return Math.max(regra.sim, regra.nao);
                }
            case 'mapa':
                {
                    return Math.max(...Object.values(regra.mapa));
                }
            case 'alternativa_correta':
                {
                    return Math.max(regra.pontos_correta, regra.pontos_errada);
                }
            default:
                return 0;
        }
    } catch (error) {
        console.error('Erro ao calcular pontuação máxima:', error);
        return 0;
    }
}
function calcularPontuacaoItem(valor_bruto, regra_pontuacao_json) {
    try {
        const regra = JSON.parse(regra_pontuacao_json);
        switch(regra.tipo){
            case 'faixas':
                {
                    const valor_numerico = parseFloat(valor_bruto);
                    if (isNaN(valor_numerico)) return 0;
                    for (const faixa of regra.faixas){
                        if (faixa.ate !== undefined && valor_numerico <= faixa.ate) {
                            return faixa.pontos;
                        }
                        if (faixa.acima !== undefined && valor_numerico > faixa.acima) {
                            return faixa.pontos;
                        }
                    }
                    return 0;
                }
            case 'sim_nao':
                {
                    const valor = valor_bruto.toLowerCase().trim();
                    if (valor === 'sim' || valor === 's' || valor === 'true' || valor === '1') {
                        return regra.sim;
                    }
                    return regra.nao;
                }
            case 'mapa':
                {
                    return regra.mapa[valor_bruto] ?? 0;
                }
            case 'alternativa_correta':
                {
                    const valor = valor_bruto.toUpperCase().trim();
                    return valor === regra.correta.toUpperCase() ? regra.pontos_correta : regra.pontos_errada;
                }
            default:
                console.error('Tipo de regra de pontuação desconhecido:', regra.tipo);
                return 0;
        }
    } catch (error) {
        console.error('Erro ao calcular pontuação:', error);
        return 0;
    }
}
function calcularScoresPorDominio(respostas, itensDoTemplate) {
    const scores = {};
    const pontuacaoMaximaPorDominio = {};
    itensDoTemplate.forEach((item)=>{
        const maxItem = calcularPontuacaoMaximaItem(item.regra_pontuacao);
        if (!pontuacaoMaximaPorDominio[item.dominioId]) {
            pontuacaoMaximaPorDominio[item.dominioId] = 0;
        }
        pontuacaoMaximaPorDominio[item.dominioId] += maxItem;
    });
    Object.keys(pontuacaoMaximaPorDominio).forEach((dominioId)=>{
        scores[dominioId] = {
            total: 0,
            pontuacao_maxima: pontuacaoMaximaPorDominio[dominioId],
            score_0a10: 0
        };
    });
    respostas.forEach((resposta)=>{
        if (scores[resposta.dominioId]) {
            scores[resposta.dominioId].total += resposta.pontuacao_item;
        }
    });
    Object.keys(scores).forEach((dominioId)=>{
        const dominio = scores[dominioId];
        if (dominio.pontuacao_maxima > 0) {
            dominio.score_0a10 = Math.min(dominio.total / dominio.pontuacao_maxima * 10, 10);
        }
    });
    return scores;
}
function calcularScoreTotal(scoresPorDominio) {
    const scores = Object.values(scoresPorDominio).map((s)=>s.score_0a10);
    if (scores.length === 0) return 0;
    return scores.reduce((acc, score)=>acc + score, 0) / scores.length;
}
}),
"[project]/app/api/admin/recalcular-scores/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pontuacao.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromToken"])(request);
        if (!user || user.perfil !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autorizado'
            }, {
                status: 401
            });
        }
        const avaliacoes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findMany({
            where: {
                status: 'CONCLUIDA'
            },
            include: {
                respostas: {
                    include: {
                        item: true
                    }
                },
                template: {
                    include: {
                        itens: {
                            include: {
                                dominio: true
                            }
                        }
                    }
                }
            }
        });
        let atualizadas = 0;
        for (const avaliacao of avaliacoes){
            const respostasComPontuacao = avaliacao.respostas.map((resposta)=>{
                const item = resposta.item;
                const pontuacao = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularPontuacaoItem"])(resposta.valor_bruto, item.regra_pontuacao);
                return {
                    itemId: item.id,
                    dominioId: resposta.dominioId,
                    valor_bruto: resposta.valor_bruto,
                    pontuacao_item: pontuacao
                };
            });
            const scoresPorDominio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularScoresPorDominio"])(respostasComPontuacao, avaliacao.template.itens.map((item)=>({
                    dominioId: item.dominioId,
                    regra_pontuacao: item.regra_pontuacao
                })));
            const scoreTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularScoreTotal"])(scoresPorDominio);
            const scores = {
                score_total: scoreTotal,
                score_fluencia: 0,
                score_cultura: 0,
                score_interpretacao: 0,
                score_atencao: 0,
                score_auto_percepcao: 0,
                score_fluencia_0a10: 0,
                score_cultura_0a10: 0,
                score_interpretacao_0a10: 0,
                score_atencao_0a10: 0,
                score_auto_percepcao_0a10: 0
            };
            Object.entries(scoresPorDominio).forEach(([dominioId, score])=>{
                const dominio = avaliacao.template.itens.find((i)=>i.dominioId === dominioId)?.dominio;
                if (!dominio) return;
                const nomeDominio = dominio.nome.toLowerCase();
                if (nomeDominio.includes('fluência') || nomeDominio.includes('fluencia')) {
                    scores.score_fluencia = score.total;
                    scores.score_fluencia_0a10 = score.score_0a10;
                } else if (nomeDominio.includes('cultura')) {
                    scores.score_cultura = score.total;
                    scores.score_cultura_0a10 = score.score_0a10;
                } else if (nomeDominio.includes('interpretação') || nomeDominio.includes('interpretacao')) {
                    scores.score_interpretacao = score.total;
                    scores.score_interpretacao_0a10 = score.score_0a10;
                } else if (nomeDominio.includes('atenção') || nomeDominio.includes('atencao')) {
                    scores.score_atencao = score.total;
                    scores.score_atencao_0a10 = score.score_0a10;
                } else if (nomeDominio.includes('auto')) {
                    scores.score_auto_percepcao = score.total;
                    scores.score_auto_percepcao_0a10 = score.score_0a10;
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.update({
                where: {
                    id: avaliacao.id
                },
                data: scores
            });
            atualizadas++;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `${atualizadas} avaliações recalculadas com sucesso`,
            atualizadas
        });
    } catch (error) {
        console.error('Erro ao recalcular scores:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao recalcular scores'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__24715421._.js.map