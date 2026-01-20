import { Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { Document } from '../schemas/document.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { DeleteDocumentService } from '../services/internal-services/delete-document.service';

interface DeleteDocumentHandlerInput extends UniqueIdDto {}

type DeleteDocumentHandlerOutput = Document;

@Injectable()
export class DeleteDocumentHandler
  implements
    CommandHandler<DeleteDocumentHandlerInput, DeleteDocumentHandlerOutput>
{
  constructor(private readonly deleteDocumentService: DeleteDocumentService) {}

  public async execute({ id }: DeleteDocumentHandlerInput) {
    const document = await this.deleteDocumentService.execute(id);

    return document;
  }
}
