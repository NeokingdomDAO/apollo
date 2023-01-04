import * as dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import type { IResolvers } from "@graphql-tools/utils";

import { getClient, Session } from "./odoo/client";
import { parseProject } from "./odoo/parsers/project";
import { parseEmployee } from "./odoo/parsers/employee";
import { parseTask } from "./odoo/parsers/task";

const typeDefs = `#graphql
  type Project {
    id: ID!
    name: String!
    tasks: [Task!]
  }

  type Employee {
    id: ID!
    userId: Int!
    name: String!
    email: String
    profilePicture: String!
  }

  type Task {
    id: ID!
    name: String!
    userId: Int!
    projectId: String!
    projectName: String!
  }

  type Query {
    projects(userId: Int): [Project]
    employees: [Employee]
    tasks(userId: Int!): [Task]
  }
`;

const resolvers: IResolvers<any, Context> = {
  Query: {
    projects: async (_parent, _args, c) => {
      const data = await c.client.search("project.project");
      return data.map(parseProject);
    },
    employees: async (_parent, _args, c) => {
      const data = await c.client.search("hr.employee");
      return data.map(parseEmployee);
    },
    tasks: async (_parent, { userId }: { userId: number }, c) => {
      const data = await c.client.search("project.task", [
        ["user_id", "=", userId],
      ]);
      return data.map(parseTask);
    },
  },

  Project: {
    tasks: async (parent, { userId }: { userId?: number }, c) => {
      const q = [];
      if (parent?.id) {
        q.push(["project_id", "=", parent.id]);
      }
      if (userId) {
        q.push(["user_id", "=", userId]);
      }
      const data = await c.client.search("project.task", q);
      return data.map(parseTask);
    },
  },
};

type Context = {
  client: Session;
  userId: number;
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }): Promise<Context> => {
    const auth = req.headers["x-odoo-auth"];
    if (!auth || Array.isArray(auth)) {
      throw new Error("Wrong auth");
    }
    const [username, password] = auth.split(":");
    const client = await getClient(
      process.env.ODOO_ENDPOINT!,
      process.env.ODOO_DB_NAME!,
      username,
      password
    );
    return {
      client,
      userId: client.uid,
    };
  },
});
console.log(`🚀 Server listening at: ${url}`);
