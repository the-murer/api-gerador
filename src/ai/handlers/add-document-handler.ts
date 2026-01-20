import { Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { AddDocumentDto } from '../dto/add-document.dto';
import { IngestDocumentService } from '../services/internal-services/ingest-document.service';
import { Document } from '../schemas/document.schema';
import { generateId } from '@app/utils/database/schema-utils';

interface AddDocumentHandlerInput extends AddDocumentDto {
  ownerId: string;
}

type AddDocumentHandlerOutput = Document;

@Injectable()
export class AddDocumentHandler
  implements CommandHandler<AddDocumentHandlerInput, AddDocumentHandlerOutput>
{
  constructor(private readonly ingestDocumentService: IngestDocumentService) {}

  public async execute({ title, fileUrl, ownerId }: AddDocumentHandlerInput) {
    const document = await this.ingestDocumentService.execute(title, {
      fileName: title,
      fileType: fileUrl,
      fileSize: 0,
      tags: ['teste'],
      metadata: {} as any,
      ownerId: generateId(ownerId),
    });

    return document;
  }
}
