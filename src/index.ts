import { readFile } from 'node:fs';
import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import fastifyApollo, {
  ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';

import 'dotenv/config';

import { resolvers } from './resolvers';
import { MyContext } from './models/my-context.model';

// create apollo context
const myContextFunction: ApolloFastifyContextFunction<MyContext> = async (
  request,
  reply,
) => ({
  request,
  reply,
});

// init app
const app = Fastify();

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const frontAppPath =
  NODE_ENV === 'development' ? '../front/build' : '../public';

app.register(fastifyStatic, {
  root: path.join(__dirname, frontAppPath),
});

app.register(cors, {
  credentials: true,
  origin: true,
});
app.register(fastifyCookie);

const plugins: ApolloServerPlugin<MyContext>[] = [
  fastifyApolloDrainPlugin(app),
];

if (
  NODE_ENV === 'production' &&
  process.env.DISPLAY_APOLLO_SANDBOX?.toLocaleLowerCase() === 'on'
)
  plugins.push(ApolloServerPluginLandingPageLocalDefault());
// read GraphQL Schema and run the server
readFile(
  path.join(__dirname, './schema.graphql'),
  { encoding: 'utf-8' },
  async (_err, typeDefs) => {
    const apollo = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins,
    });

    await apollo.start();
    await app.register(fastifyApollo(apollo), {
      context: myContextFunction,
    });
    app.get('/', (_, reply) => {
      reply.sendFile('index.html', path.join(__dirname, frontAppPath));
    });
    app.listen(
      {
        port: Number.parseInt(process.env.PORT ?? '3001'),
        host: process.env.HOST ?? '0.0.0.0',
      },
      (err, address) => {
        if (err) {
          app.log.error(err);
          process.exit(1);
        }
        console.info(`🚂 server listening on ${address}`);
        app.log.info(`🚂 server listening on ${address}`);
      },
    );
  },
);
