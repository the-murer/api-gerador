import {
  Injectable,
} from '@nestjs/common';
import { DocumentsRepository } from '@app/ai/repositories/document.repository';
import { ConfigService } from '@nestjs/config';
import { embed } from 'ai';
import { Embed, SearchResult } from '@app/ai/constants';
import { openai } from '@ai-sdk/openai';
import { QdrantClient } from '@qdrant/js-client-rest';


@Injectable()
export class VectorSearchService {
  private indexName: string;
  private qdrantClient: QdrantClient;
  private embeddingModel = openai.embedding('text-embedding-3-small');

  constructor(private readonly configService: ConfigService) {
    this.indexName = this.configService.get('QDRANT_COLLECTION_NAME') || this.configService.get('QDRANT_INDEX_NAME') || 'documents';

    this.qdrantClient = new QdrantClient({
      url: this.configService.get('QDRANT_ENDPOINT'),
      apiKey: this.configService.get('QDRANT_API_KEY'),
    });
  }

  async search(
    query: string,
    options: {
      limit?: number;
      userId?: string;
      fileTypes?: string[];
      tags?: string[];
      minScore?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const {
      limit = 10,
      userId,
      fileTypes,
      tags,
      minScore = 0.7,
    } = options;

    try {
      const queryEmbedding = await this.vectorizeText(query);

      // Build Qdrant filter
      const filterConditions: any[] = [];

      if (userId) {
        filterConditions.push({
          key: 'metadata.userId',
          match: { value: userId }
        });
      }

      if (fileTypes && fileTypes.length > 0) {
        filterConditions.push({
          key: 'metadata.fileType',
          match: { any: fileTypes }
        });
      }

      if (tags && tags.length > 0) {
        filterConditions.push({
          key: 'metadata.tags',
          match: { any: tags }
        });
      }

      const searchParams: any = {
        vector: queryEmbedding,
        limit: limit,
        score_threshold: minScore,
        with_payload: true,
      };

      if (filterConditions.length > 0) {
        searchParams.filter = {
          must: filterConditions
        };
      }

      const response = await this.qdrantClient.search(this.indexName, searchParams);

      return response.map((result: any) => ({
        content: result.payload?.content || '',
        score: result.score || 0,
        metadata: result.payload?.metadata || {},
        chunkIndex: result.payload?.chunkIndex || 0,
      }));
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  }

  async rerankSearch(
    query: string,
    options: {
      limit?: number;
      rerankLimit?: number;
      userId?: string;
      fileTypes?: string[];
      tags?: string[];
    } = {}
  ): Promise<SearchResult[]> {
    const { limit = 10, rerankLimit = 50, ...searchOptions } = options;

    const initialResults = await this.search(query, {
      ...searchOptions,
      limit: rerankLimit,
    });

    const rerankedResults = await this.rerankByContext(
      initialResults,
      query
    );

    return rerankedResults.slice(0, limit);
  }

  private async rerankByContext(
    results: SearchResult[],
    query: string
  ): Promise<SearchResult[]> {
    const grouped = new Map<string, SearchResult[]>();

    results.forEach(result => {
      const docId = result.metadata._id?.toString() || '';
      if (!grouped.has(docId)) {
        grouped.set(docId, []);
      }
      grouped.get(docId)!.push(result);
    });

    const scored = results.map(result => {
      const docId = result.metadata._id?.toString() || '';
      const docChunks = grouped.get(docId) || [];
      const contextBoost = Math.log(docChunks.length + 1) * 0.1;

      return {
        ...result,
        score: result.score + contextBoost,
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  }

  async vectorizeText(text: string): Promise<Embed> {
    const { embedding } = await embed({
      model: this.embeddingModel,
      value: text,
    });
    return embedding;
  }
}










// import {
//   Injectable,
// } from '@nestjs/common';
// import { embed, embedMany } from 'ai';
// import { openai } from '@ai-sdk/openai';
// import { Document } from '../schemas/document.schema';
// import { ConfigService } from '@nestjs/config';
// import { Client } from '@opensearch-project/opensearch';
// import { DocumentsRepository } from '../repositories/document.repository';

// export interface SearchResult {
//   content: string;
//   score: number;
//   metadata: Document;
//   chunkIndex: number;
// }
// export type Embed = number[];

// @Injectable()
// export class AiService {
//   private embeddingModel = openai.embedding('text-embedding-3-small');
//   private indexName: string;
//   private openSearchClient: Client;

//   constructor(
//     private readonly documentRepository: DocumentsRepository,
//     private readonly configService: ConfigService,
//   ) {
//     this.indexName = this.configService.get('OPEN_SEARCH_INDEX_NAME')!;

//     this.openSearchClient = new Client({
//       node: this.configService.get('OPEN_SEARCH_NODE')!,
//       auth: {
//         username: this.configService.get('OPEN_SEARCH_USERNAME')!,
//         password: this.configService.get('OPEN_SEARCH_PASSWORD')!,
//       },
//     });
//   }

//   // ============================================================================
//   // VETORIZAÇÃO
//   // ============================================================================

//   async vectorizeText(text: string): Promise<Embed> {
//     const { embedding } = await embed({
//       model: this.embeddingModel,
//       value: text,
//     });
//     return embedding;
//   }

//   async vectorizeTexts(texts: string[]): Promise<Embed[]> {
//     const { embeddings } = await embedMany({
//       model: this.embeddingModel,
//       values: texts,
//     });
//     return embeddings;
//   }

//   // ============================================================================
//   // INGESTÃO EM LOTE
//   // ============================================================================

//   // async ingestDocuments(
//   //   documents: Array<{
//   //     content: string;
//   //     metadata: Omit<Document, '_id' | 'uploadDate'>;
//   //   }>
//   // ): Promise<string[]> {
//   //   const documentIds: string[] = [];

//   //   for (const doc of documents) {
//   //     const document = await this.ingestDocument(doc.content, doc.metadata);
//   //     documentIds.push(document._id.toString());
//   //   }

//   //   return documentIds;
//   // }

// }
