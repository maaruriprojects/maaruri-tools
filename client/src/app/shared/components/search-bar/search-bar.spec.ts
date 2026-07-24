import { TestBed } from '@angular/core/testing';
import type { SearchIndexEntry } from '../../models/search-index-entry';
import { AppSearchBar } from './search-bar';

describe('AppSearchBar', () => {
  const sampleEntries: SearchIndexEntry[] = [
    { slug: 'digital-clock', title: 'Digital Clock', category: 'time-date-tools' },
    { slug: 'bmi-calculator', title: 'BMI Calculator', category: 'health-fitness' },
    { slug: 'loan-calculator', title: 'Loan Calculator', category: 'finance-money-tools' },
    { slug: 'json-formatter', title: 'JSON Formatter', category: 'development-web-tools' },
  ];

  async function createFixture(entries: SearchIndexEntry[] = sampleEntries) {
    await TestBed.configureTestingModule({ imports: [AppSearchBar] }).compileComponents();
    const fixture = TestBed.createComponent(AppSearchBar);
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
    return fixture;
  }

  function getInput(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
    return fixture.nativeElement.querySelector('.app-search-bar__input') as HTMLInputElement;
  }

  function typeInto(fixture: { nativeElement: HTMLElement }, value: string): void {
    const input = getInput(fixture);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('requires no HttpClient/HttpTestingController — it is a pure @Input-driven component', async () => {
    // No provideHttpClient()/provideHttpClientTesting() anywhere in this
    // spec: if AppSearchBar reached for HTTP on its own (rather than taking
    // `entries` as an input, per COMPONENT_GUIDELINES.md), this would throw
    // a "no provider" error at construction time.
    await expect(createFixture()).resolves.toBeTruthy();
  });

  it('uses the "Search tools..." placeholder by default', async () => {
    const fixture = await createFixture();
    expect(getInput(fixture).placeholder).toBe('Search tools...');
  });

  it('accepts a custom placeholder', async () => {
    await TestBed.configureTestingModule({ imports: [AppSearchBar] }).compileComponents();
    const fixture = TestBed.createComponent(AppSearchBar);
    fixture.componentRef.setInput('entries', sampleEntries);
    fixture.componentRef.setInput('placeholder', 'Find a tool');
    fixture.detectChanges();

    expect(getInput(fixture).placeholder).toBe('Find a tool');
  });

  it('shows no dropdown while the query is empty', async () => {
    const fixture = await createFixture();
    expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeNull();
  });

  it('opens the dropdown instantly on the first keystroke, before the debounce elapses', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      typeInto(fixture, 'd');
      fixture.detectChanges();

      // Open immediately — this is the raw `query` signal, not the
      // debounced one, per "showing a suggestion dropdown as soon as the
      // first character is typed."
      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeTruthy();
      // But filtering hasn't run yet — debouncedQuery is still ''.
      expect(fixture.nativeElement.querySelector('.app-search-bar__option')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('filters results only after the ~150ms debounce elapses', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      typeInto(fixture, 'Digital');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.app-search-bar__option')).toHaveLength(0);

      vi.advanceTimersByTime(149);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.app-search-bar__option')).toHaveLength(0);

      vi.advanceTimersByTime(1);
      fixture.detectChanges();
      const options = fixture.nativeElement.querySelectorAll('.app-search-bar__option');
      expect(options).toHaveLength(1);
      expect(options[0].textContent).toContain('Digital Clock');
    } finally {
      vi.useRealTimers();
    }
  });

  it('matches from the start of the title, case-insensitively', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      typeInto(fixture, 'json');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.app-search-bar__option');
      expect(options).toHaveLength(1);
      expect(options[0].textContent).toContain('JSON Formatter');
    } finally {
      vi.useRealTimers();
    }
  });

  it('falls back to a "contains" match when nothing matches from the start (deliberate addition beyond spec)', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      // "Digital Clock" does not start with "clock" — only the
      // contains-fallback finds it.
      typeInto(fixture, 'clock');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.app-search-bar__option');
      expect(options).toHaveLength(1);
      expect(options[0].textContent).toContain('Digital Clock');
    } finally {
      vi.useRealTimers();
    }
  });

  it('prefers start-of-string matches over contains matches when both exist', async () => {
    vi.useFakeTimers();
    try {
      const entries: SearchIndexEntry[] = [
        { slug: 'calculator', title: 'Calculator', category: 'converters-calculators' },
        { slug: 'loan-calculator', title: 'Loan Calculator', category: 'finance-money-tools' },
      ];
      const fixture = await createFixture(entries);

      typeInto(fixture, 'calc');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      // "Loan Calculator" contains "calc" but doesn't start with it — the
      // fallback should only kick in when start-of-string finds nothing.
      const options = fixture.nativeElement.querySelectorAll('.app-search-bar__option');
      expect(options).toHaveLength(1);
      expect(options[0].textContent).toContain('Calculator');
      expect(options[0].textContent).not.toContain('Loan');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows the "no tools match" empty state when nothing matches', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      typeInto(fixture, 'zzz');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector('.app-search-bar__empty');
      expect(empty?.textContent).toContain('No tools match "zzz"');
    } finally {
      vi.useRealTimers();
    }
  });

  it('caps suggestions at 8 even when more entries match', async () => {
    vi.useFakeTimers();
    try {
      const manyEntries: SearchIndexEntry[] = Array.from({ length: 10 }, (_, i) => ({
        slug: `tool-${i}`,
        title: `Tool ${i}`,
        category: 'development-web-tools',
      }));
      const fixture = await createFixture(manyEntries);

      typeInto(fixture, 'Tool');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.app-search-bar__option')).toHaveLength(8);
    } finally {
      vi.useRealTimers();
    }
  });

  it('ArrowDown/ArrowUp move the highlight and wrap at the ends', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();
      const input = getInput(fixture);

      typeInto(fixture, 'Calculator');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();
      // Matches: BMI Calculator, Loan Calculator (contains-fallback, since
      // neither starts with "Calculator") — order follows `entries` order.
      const options = () => fixture.nativeElement.querySelectorAll('.app-search-bar__option');
      expect(options()).toHaveLength(2);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();
      expect(options()[0].classList).toContain('app-search-bar__option--highlighted');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();
      expect(options()[1].classList).toContain('app-search-bar__option--highlighted');

      // Wraps back to the first entry.
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();
      expect(options()[0].classList).toContain('app-search-bar__option--highlighted');

      // Wraps backward to the last entry.
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();
      expect(options()[1].classList).toContain('app-search-bar__option--highlighted');
    } finally {
      vi.useRealTimers();
    }
  });

  it('Enter selects the highlighted entry, emits select, and clears/closes', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();
      const input = getInput(fixture);
      const selected: SearchIndexEntry[] = [];
      fixture.componentInstance.toolSelected.subscribe((entry: SearchIndexEntry) =>
        selected.push(entry),
      );

      typeInto(fixture, 'Digital');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(selected).toEqual([sampleEntries[0]]);
      expect(getInput(fixture).value).toBe('');
      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('Enter with nothing highlighted does not emit select', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();
      const input = getInput(fixture);
      const selected: SearchIndexEntry[] = [];
      fixture.componentInstance.toolSelected.subscribe((entry: SearchIndexEntry) =>
        selected.push(entry),
      );

      typeInto(fixture, 'Digital');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(selected).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('Escape clears the query and closes the dropdown', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();
      const input = getInput(fixture);

      typeInto(fixture, 'Digital');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeTruthy();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('');
      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('clicking an option selects it and emits select', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();
      const selected: SearchIndexEntry[] = [];
      fixture.componentInstance.toolSelected.subscribe((entry: SearchIndexEntry) =>
        selected.push(entry),
      );

      typeInto(fixture, 'Digital');
      vi.advanceTimersByTime(150);
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(
        '.app-search-bar__option',
      ) as HTMLButtonElement;
      option.click();
      fixture.detectChanges();

      expect(selected).toEqual([sampleEntries[0]]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes the dropdown when a click occurs outside the component', async () => {
    vi.useFakeTimers();
    try {
      const fixture = await createFixture();

      typeInto(fixture, 'Digital');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeTruthy();

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.app-search-bar__dropdown')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
