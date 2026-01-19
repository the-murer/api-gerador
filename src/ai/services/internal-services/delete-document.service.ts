import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentsRepository } from '@app/ai/repositories/document.repository';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class DeleteDocumentService {
  private indexName: string;
  private qdrantClient: QdrantClient;

  constructor(
    private readonly documentRepository: DocumentsRepository,
    private readonly configService: ConfigService) {
    this.indexName = this.configService.get('QDRANT_COLLECTION_NAME') || this.configService.get('QDRANT_INDEX_NAME') || 'documents';

    this.qdrantClient = new QdrantClient({
      url: this.configService.get('QDRANT_ENDPOINT'),
      apiKey: this.configService.get('QDRANT_API_KEY'),
    });
  }

  async execute(documentId: string): Promise<void> {
    try {
      const result = await this.documentRepository.delete(documentId);

      if (!result) {
        throw new NotFoundException('Documento não encontrado');
      }

      await this.qdrantClient.delete(this.indexName, {
        points: [documentId],
        filter: {
          must: [
            {
              key: 'metadata.documentId',
              match: { value: documentId },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  }
}
