import { PartialType } from '@nestjs/swagger';
import { CreateMagicItemDto } from './create-magic-item.dto';

export class UpdateMagicItemDto extends PartialType(CreateMagicItemDto) {} 