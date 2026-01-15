import { Module } from "@nestjs/common";
import { CleanFilesService } from "./clen-files.service";
import { FilesModule } from "@app/files/files.module";

@Module({
    imports: [FilesModule],
    providers: [CleanFilesService],
  })
  export class TasksModule {}
  