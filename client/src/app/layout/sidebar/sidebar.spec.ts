import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppSidebar } from './sidebar';

@Component({
  selector: 'app-sidebar-host',
  imports: [AppSidebar],
  template: `<app-sidebar><div class="projected">Ad slot</div></app-sidebar>`,
})
class HostComponent {}

describe('AppSidebar', () => {
  it('renders projected content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const projected = (fixture.nativeElement as HTMLElement).querySelector('.projected');
    expect(projected?.textContent).toBe('Ad slot');
  });
});
