import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppToolTile } from './tool-tile';
import type { ToolMeta } from '../../../shared/models/tool-meta';

const mockTool: ToolMeta = {
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  category: 'health-fitness',
  shortDescription: 'Calculate your Body Mass Index from height and weight.',
  componentKey: 'bmi-calculator',
  seoDescription: 'A BMI calculator.',
  icon: 'heart-rate-monitor',
};

describe('AppToolTile', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppToolTile, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppToolTile);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the tool name and description in grid layout', async () => {
    const fixture = await setup({ tool: mockTool, link: ['/bmi'] });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.app-tool-tile__name')?.textContent).toContain('BMI Calculator');
    expect(el.querySelector('.app-tool-tile__desc')?.textContent).toContain('Body Mass Index');
  });

  it('renders the tool icon', async () => {
    const fixture = await setup({ tool: mockTool, link: ['/bmi'] });
    expect(fixture.nativeElement.querySelector('svg.app-icon')).toBeTruthy();
  });

  it('hides description in compact layout', async () => {
    const fixture = await setup({ tool: mockTool, link: ['/bmi'], layout: 'compact' });
    expect(fixture.nativeElement.querySelector('.app-tool-tile__desc')).toBeNull();
  });

  it('renders nothing when tool is undefined', async () => {
    const fixture = await setup({ tool: undefined });
    expect(fixture.nativeElement.querySelector('.app-tool-tile')).toBeNull();
  });

  it('applies category color as a CSS variable', async () => {
    const fixture = await setup({ tool: mockTool, link: ['/bmi'] });
    const tile = fixture.nativeElement.querySelector('.app-tool-tile') as HTMLElement;
    expect(tile.style.getPropertyValue('--tile-category-color')).toContain('cat-color');
  });
});
