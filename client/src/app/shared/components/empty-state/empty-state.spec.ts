import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppEmptyState } from './empty-state';

describe('AppEmptyState', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppEmptyState],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppEmptyState);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the message', async () => {
    const fixture = await setup({ message: 'No tools found' });
    expect(fixture.nativeElement.querySelector('.app-empty-state__message')?.textContent).toContain('No tools found');
  });

  it('renders an action button when actionLabel is provided', async () => {
    const fixture = await setup({ message: 'Empty', actionLabel: 'Browse all' });
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Browse all');
  });

  it('does not render a button when actionLabel is not provided', async () => {
    const fixture = await setup({ message: 'Empty' });
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('emits action when button is clicked', async () => {
    const fixture = await setup({ message: 'Empty', actionLabel: 'Retry' });
    let fired = false;
    fixture.componentInstance.action.subscribe(() => (fired = true));
    fixture.nativeElement.querySelector('button').click();
    expect(fired).toBe(true);
  });

  it('renders an icon when icon is provided', async () => {
    const fixture = await setup({ message: 'Empty', icon: 'inbox' });
    expect(fixture.nativeElement.querySelector('svg.app-icon')).toBeTruthy();
  });
});
