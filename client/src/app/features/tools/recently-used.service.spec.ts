import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RecentlyUsedService } from './recently-used.service';

describe('RecentlyUsedService', () => {
  let service: RecentlyUsedService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [RecentlyUsedService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(RecentlyUsedService);
  });

  afterEach(() => localStorage.clear());

  it('starts empty', () => expect(service.recentTools()).toEqual([]));

  it('adds a tool to the front', () => {
    service.add('bmi-calculator', 'health-fitness');
    expect(service.recentTools()[0].slug).toBe('bmi-calculator');
  });

  it('deduplicates by slug, moving to front', () => {
    service.add('digital-clock', 'time-date-tools');
    service.add('bmi-calculator', 'health-fitness');
    service.add('digital-clock', 'time-date-tools');
    expect(service.recentTools().map((tool) => tool.slug)).toEqual([
      'digital-clock',
      'bmi-calculator',
    ]);
  });

  it('caps at 6 entries', () => {
    for (let i = 0; i < 8; i++) service.add(`tool-${i}`, 'time-date-tools');
    expect(service.recentTools()).toHaveLength(6);
    expect(service.recentTools()[0].slug).toBe('tool-7');
  });

  it('clears history', () => {
    service.add('bmi-calculator', 'health-fitness');
    service.clear();
    expect(service.recentTools()).toEqual([]);
  });

  it('persists to localStorage', () => {
    service.add('bmi-calculator', 'health-fitness');
    const parsed = JSON.parse(localStorage.getItem('maaruri-recent-tools')!);
    expect(parsed[0].slug).toBe('bmi-calculator');
  });

  it('loads from localStorage on construction', () => {
    localStorage.setItem(
      'maaruri-recent-tools',
      JSON.stringify([{ slug: 'digital-clock', category: 'time-date-tools', timestamp: 12345 }]),
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [RecentlyUsedService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const newService = TestBed.inject(RecentlyUsedService);
    expect(newService.recentTools()[0].slug).toBe('digital-clock');
  });

  it('is empty on SSR', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [RecentlyUsedService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const serverService = TestBed.inject(RecentlyUsedService);
    serverService.add('bmi-calculator', 'health-fitness');
    expect(serverService.recentTools()).toEqual([]);
  });
});
