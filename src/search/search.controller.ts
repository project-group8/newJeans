import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CardPosts } from '../entities/CardPosts.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('/')
  async search(@Query('q') query: string): Promise<{ data: CardPosts[] }> {
    const results = await this.searchService.search(query);

    return { data: results };
  }
}
