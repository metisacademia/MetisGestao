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
async function getUserFromToken() {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
}),
"[project]/lib/pontuacao.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcularPontuacaoItem",
    ()=>calcularPontuacaoItem,
    "calcularScoreTotal",
    ()=>calcularScoreTotal,
    "calcularScoresPorDominio",
    ()=>calcularScoresPorDominio
]);
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
function calcularScoresPorDominio(respostas, dominios) {
    const scores = {};
    dominios.forEach((dominio)=>{
        scores[dominio.id] = {
            total: 0,
            pontuacao_maxima: dominio.pontuacao_maxima,
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
        if (dominio.total > 0 && dominio.pontuacao_maxima > 0) {
            dominio.score_0a10 = dominio.total / dominio.pontuacao_maxima * 10;
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
"[project]/app/api/admin/avaliacao/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
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
async function GET(request, { params }) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromToken"])();
        if (!user || user.perfil !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autorizado'
            }, {
                status: 401
            });
        }
        const { id: alunoId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const mes = Number(searchParams.get('mes'));
        const ano = Number(searchParams.get('ano'));
        const avaliacao = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findFirst({
            where: {
                alunoId,
                mes_referencia: mes,
                ano_referencia: ano
            },
            include: {
                respostas: true
            }
        });
        if (!avaliacao) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Avaliação não encontrada'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(avaliacao);
    } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno'
        }, {
            status: 500
        });
    }
}
async function POST(request, { params }) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserFromToken"])();
        if (!user || user.perfil !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autorizado'
            }, {
                status: 401
            });
        }
        const { alunoId, templateId, mes_referencia, ano_referencia, data_aplicacao, respostas } = await request.json();
        const aluno = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].aluno.findUnique({
            where: {
                id: alunoId
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
        const template = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].templateAvaliacao.findUnique({
            where: {
                id: templateId
            },
            include: {
                itens: {
                    include: {
                        dominio: true
                    }
                }
            }
        });
        if (!template) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Template não encontrado'
            }, {
                status: 404
            });
        }
        if (!template.ativo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'O template selecionado não está mais ativo'
            }, {
                status: 400
            });
        }
        if (template.mes_referencia !== mes_referencia || template.ano_referencia !== ano_referencia) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Template não corresponde ao mês/ano da avaliação'
            }, {
                status: 400
            });
        }
        const avaliacaoExistente = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.findFirst({
            where: {
                alunoId,
                mes_referencia,
                ano_referencia
            }
        });
        if (avaliacaoExistente) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].respostaItem.deleteMany({
                where: {
                    avaliacaoId: avaliacaoExistente.id
                }
            });
        }
        const respostasComPontuacao = template.itens.filter((item)=>respostas[item.id]).map((item)=>{
            const valor_bruto = respostas[item.id];
            const pontuacao = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularPontuacaoItem"])(valor_bruto, item.regra_pontuacao);
            const valor_numerico = parseFloat(valor_bruto);
            return {
                itemId: item.id,
                dominioId: item.dominioId,
                valor_bruto,
                valor_numerico,
                pontuacao_item: pontuacao
            };
        });
        const scores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularScoresPorDominio"])(template.itens, respostasComPontuacao);
        const scoreTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pontuacao$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calcularScoreTotal"])(scores);
        const scoresToSave = {
            score_total: scoreTotal
        };
        scores.forEach(({ dominio, score })=>{
            const nomeDominio = dominio.nome.toLowerCase();
            if (nomeDominio.includes('fluência') || nomeDominio.includes('fluencia')) {
                scoresToSave.score_fluencia = score.total;
                scoresToSave.score_fluencia_0a10 = score.score_0a10;
            } else if (nomeDominio.includes('cultura')) {
                scoresToSave.score_cultura = score.total;
                scoresToSave.score_cultura_0a10 = score.score_0a10;
            } else if (nomeDominio.includes('interpretação') || nomeDominio.includes('interpretacao')) {
                scoresToSave.score_interpretacao = score.total;
                scoresToSave.score_interpretacao_0a10 = score.score_0a10;
            } else if (nomeDominio.includes('atenção') || nomeDominio.includes('atencao')) {
                scoresToSave.score_atencao = score.total;
                scoresToSave.score_atencao_0a10 = score.score_0a10;
            } else if (nomeDominio.includes('auto')) {
                scoresToSave.score_auto_percepcao = score.total;
                scoresToSave.score_auto_percepcao_0a10 = score.score_0a10;
            }
        });
        const avaliacaoData = {
            alunoId,
            turmaId: aluno.turmaId,
            templateId,
            mes_referencia,
            ano_referencia,
            data_aplicacao: data_aplicacao ? new Date(data_aplicacao) : new Date(),
            status: 'CONCLUIDA',
            ...scoresToSave
        };
        const avaliacao = avaliacaoExistente ? await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.update({
            where: {
                id: avaliacaoExistente.id
            },
            data: avaliacaoData
        }) : await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].avaliacao.create({
            data: avaliacaoData
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].respostaItem.createMany({
            data: respostasComPontuacao.map((resp)=>({
                    avaliacaoId: avaliacao.id,
                    itemId: resp.itemId,
                    dominioId: resp.dominioId,
                    valor_bruto: resp.valor_bruto,
                    valor_numerico: resp.valor_numerico,
                    pontuacao_item: resp.pontuacao_item
                }))
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            avaliacaoId: avaliacao.id
        });
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro ao salvar avaliação'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7ae920f4._.js.map