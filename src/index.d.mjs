/**
 * ----------------------------------------------------------------------------
 * library types
 * ----------------------------------------------------------------------------
 */
/** @typedef {import('fastify').FastifyInstance} Fastify */
/** @typedef {import('fastify').FastifyRequest} Request */
/** @typedef {import('fastify').FastifyReply} Reply */
/** @typedef {import('fastify').DoneFuncWithErrOrRes} Done */
/** @typedef {function(Request, Reply, Done): void} Middleware */
/** @typedef {import('fastify').RouteShorthandOptionsWithHandler} Route */
/** @typedef {import('fastify').FastifySchema} Schema */


/**
 * ----------------------------------------------------------------------------
 * misc. types
 * ----------------------------------------------------------------------------
 */
/** @typedef {"auth" | "firstPassword" | "passwordReset"} TokenTypes */


/**
 * ----------------------------------------------------------------------------
 * model types
 * ----------------------------------------------------------------------------
 */
/** @typedef {import('@prisma/client').Password} Password */
/** @typedef {import('@prisma/client').User} User */
/** @typedef {User & { password: Password }} UserWithPassword */
/** @typedef {"ADMIN" | "USER"} UserRole */


export { }
