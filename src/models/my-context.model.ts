import { FastifyReply, FastifyRequest } from 'fastify';

// Apollo server application context
export interface MyContext {
  request: FastifyRequest;
  reply: FastifyReply;
}
