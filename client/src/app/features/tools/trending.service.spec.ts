import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TrendingService } from './trending.service';
import { ToolRegistryService } from './tool-registry.service';
import type { ToolMeta } from '../../shared/models/tool-meta';

const sampleTools: ToolMeta[] = Array.from({ length: 10 }, (_, i) => ({
  slug: `tool-${String(i).padStart(2, '0')}`,
  title: `Tool ${i}`,
  category: 'time-date-tools',
  shortDescription: `Tool ${i} description`,
  componentKey: `Tool${i}`,
  seoDescription: `Tool ${i} SEO`,
  icon: 'clock',
}));

describe('TrendingService', () => {
  function setup(tools: readonly ToolMeta[]) {
    TestBed.configureTestingModule({
      providers: [
        TrendingService,
        {
          provide: ToolRegistryService,
          useValue: {
            tools: signal(tools),
            error: signal(null),
          },
        },
      ],
    });
    return TestBed.inject(TrendingService);
  }

  it('returns empty array when registry is empty', () => {
    const service = setup([]);
    expect(service.trendingTools()).toEqual([]);
  });

  it('returns up to 6 tools sorted alphabetically by slug', () => {
    const service = setup(sampleTools);
    expect(service.trendingTools()).toHaveLength(6);
    expect(service.trendingTools()[0].slug).toBe('tool-00');
    expect(service.trendingTools()[5].slug).toBe('tool-05');
  });

  it('returns fewer than 6 when registry has fewer tools', () => {
    const service = setup(sampleTools.slice(0, 3));
    expect(service.trendingTools()).toHaveLength(3);
  });
});
