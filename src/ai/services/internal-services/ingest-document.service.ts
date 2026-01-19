import {
  Injectable,
} from '@nestjs/common';
import { generateId } from '@app/utils/database/schema-utils';
import { Document } from '@app/ai/schemas/document.schema';
import { DocumentsRepository } from '@app/ai/repositories/document.repository';
import { BATCH_SIZE, CHUNK_OVERLAP, CHUNK_SIZE } from '@app/ai/constants';
import { Embed } from '@app/ai/constants';
import { embedMany } from 'ai';
import { ConfigService } from '@nestjs/config';
import { openai } from '@ai-sdk/openai';
import { QdrantClient } from '@qdrant/js-client-rest';


@Injectable()
export class IngestDocumentService {
  private indexName: string;
  private qdrantClient: QdrantClient;
  private embeddingModel = openai.embedding('text-embedding-3-small');

  constructor(
    private readonly documentRepository: DocumentsRepository,
    private readonly configService: ConfigService) {
    this.indexName = this.configService.get('QDRANT_COLLECTION_NAME') || this.configService.get('QDRANT_INDEX_NAME') || 'documents';

    this.qdrantClient = new QdrantClient({
      url: this.configService.get('QDRANT_ENDPOINT'),
      apiKey: this.configService.get('QDRANT_API_KEY'),
    });
  }


  async execute(
    content: string,
    metadata: Omit<Document, '_id' | 'uploadDate'>
  ): Promise<Document> {
    try {


      const document: Document = {
        _id: generateId(),
        ...metadata,
        uploadDate: new Date(),
      };

      await this.documentRepository.create(document);

      const chunks = this.chunkText(content);
      const totalChunks = chunks.length;

      await this.processChunksInBatches(
        chunks,
        document._id.toString(),
        document,
        totalChunks
      );

      return document;
    } catch (error) {
      console.error('Erro ao ingerir documento:', error);
      throw error;
    }
  }


  private async processChunksInBatches(
    chunks: string[],
    documentId: string,
    metadata: Document,
    totalChunks: number
  ): Promise<void> {
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const embeddings = await this.vectorizeTexts(batch);

      const points = batch.map((chunk, batchIndex) => {
        const chunkIndex = i + batchIndex;
        const chunkId = `${documentId}_chunk_${chunkIndex}`;

        return {
          id: chunkId,
          vector: embeddings[batchIndex],
          payload: {
            content: chunk,
            metadata,
            chunkIndex,
            totalChunks,
          },
        };
      });

      await this.qdrantClient.upsert(this.indexName, {
        points,
      });
    }
  }


  async vectorizeTexts(texts: string[]): Promise<Embed[]> {
    const { embeddings } = await embedMany({
      model: this.embeddingModel,
      values: texts,
    });
    return embeddings;
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = start + CHUNK_SIZE;

      // Ajustar para não quebrar no meio de uma palavra
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        const lastNewline = text.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastSpace, lastNewline);

        if (breakPoint > start) {
          end = breakPoint;
        }
      }

      chunks.push(text.slice(start, end).trim());
      start = end - CHUNK_OVERLAP;
    }

    return chunks.filter(chunk => chunk.length > 0);
  }
}
