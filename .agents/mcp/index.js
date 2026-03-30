import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

const server = new Server(
  {
    name: "rg-academy-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool: list_repository_structure
 * Efficiency: High-speed recursive directory tree mapping.
 */
async function listRepositoryStructure(dirPath) {
  const result = [];
  async function recursive(dir, depth = 0) {
    if (depth > 3) return; // Limit depth for safety
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file === "node_modules" || file === ".git") continue;
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      result.push({ path: path.relative(process.cwd(), fullPath), isDir: stat.isDirectory() });
      if (stat.isDirectory()) {
         await recursive(fullPath, depth + 1);
      }
    }
  }
  await recursive(dirPath);
  return result;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_repository_structure",
        description: "High-speed recursive directory tree mapping for context retrieval.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
         name: "get_module_context",
         description: "Extracts context from specific functional modules (e.g., /api/src/routes).",
         inputSchema: {
            type: "object",
            properties: {
               modulePath: { type: "string" }
            },
            required: ["modulePath"]
         }
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "list_repository_structure": {
      const structure = await listRepositoryStructure(process.cwd());
      return {
        content: [{ type: "text", text: JSON.stringify(structure, null, 2) }],
      };
    }
    case "get_module_context": {
      const modulePath = request.params.arguments.modulePath;
      const fullPath = path.join(process.cwd(), modulePath);
      const content = await fs.readFile(fullPath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    }
    default:
      throw new Error("Unknown tool");
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("RG Academy MCP Server running on stdio");
