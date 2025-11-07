// const { OpenAI } = require('openai');
// const { createClient } = require('@supabase/supabase-js');

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// const TABLE_NAME = 'plan_embeddings';

// async function createEmbedding(text) {
//   const response = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: text
//   });
//   return response.data[0].embedding;
// }

// async function queryEmbeddingStore(action, payload) {
//   if (action === 'insert') {
//     const { id, planId, embedding, text, metadata } = payload;
//     const { error } = await supabase.from(TABLE_NAME)
//       .upsert(
//         {
//           id,
//           plan_id: planId,
//           embedding,
//           content: text,
//           metadata: metadata || null
//         },
//         { onConflict: 'id' }
//       );

//     if (error) {
//       console.error('❌ Supabase insert error:', error);
//       throw error;
//     }
//     return;
//   }

//   if (action === 'search') {
//     const { query, filter } = payload;
//     const embedding = await createEmbedding(query);
//     const { data, error } = await supabase.rpc('match_plan_chunks', {
//       query_embedding: embedding,
//       match_count: 5,
//       filter_plan_id: filter.planId
//     });
//     if (error) {
//       console.error('❌ Supabase search error:', error);
//       throw error;
//     }
//     return data.map(row => ({
//       text: row.content,
//       score: row.similarity
//     }));
//   }

//   throw new Error("Unsupported action");
// }

// module.exports = { createEmbedding, queryEmbeddingStore };








const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
const apiKey = process.env.AZURE_SEARCH_ADMIN_KEY;

const searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

async function queryEmbeddingStore(action, options) {
  if (action === "insert") {
    const { id, planId, text, embedding, metadata } = options;

    await searchClient.uploadDocuments([
      {
        id,
        planId,
        content: text,
        embedding,
        chunkIndex: metadata?.chunkIndex || 0,
        section: metadata?.section || "",
      }
    ]);
  }

  else if (action === "search") {
    const { queryEmbedding, filter, k = 5 } = options;

    if (!queryEmbedding || !filter?.planId) {
      throw new Error("Missing queryEmbedding or planId");
    }

    const results = await searchClient.search("", {
      vector: {
        value: queryEmbedding,
        fields: "embedding",
        k: k,
      },
      filter: `planId eq '${filter.planId}'`,
      top: k,
    });

    const chunks = [];
    for await (const result of results.results) {
      chunks.push({
        text: result.document.content,
        score: result.score,
      });
    }

    return chunks;
  }

  else {
    throw new Error(`Unknown queryEmbeddingStore action: ${action}`);
  }
}
