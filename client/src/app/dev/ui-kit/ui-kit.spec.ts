import { TestBed } from '@angular/core/testing';
import { UiKit } from './ui-kit';

describe('UiKit', () => {
  it('renders every button variant and badge color', async () => {
    await TestBed.configureTestingModule({ imports: [UiKit] }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-button')).toHaveLength(4); // 3 variants + 1 disabled
    expect(el.querySelectorAll('app-badge')).toHaveLength(5);
    expect(el.querySelector('.app-button--primary[disabled]')).toBeTruthy();
  });
});
