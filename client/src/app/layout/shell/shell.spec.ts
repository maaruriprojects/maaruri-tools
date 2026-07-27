import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import { AppShell } from './shell';

describe('AppShell', () => {
  const sampleSearchEntries: SearchIndexEntry[] = [];

  @Component({ selector: 'app-test-page', template: 'page content' })
  class TestPage {}

  const routes: Routes = [
    {
      path: 'en-us',
      component: TestPage,
      data: { breadcrumbLabel: 'Home' },
      children: [{ path: '', pathMatch: 'full', component: TestPage, data: {} }],
    },
  ];

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    await RouterTestingHarness.create('/en-us');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders header, breadcrumb, routed content, and footer together', () => {
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('app-breadcrumb')).toBeTruthy();
    expect(el.querySelector('app-footer')).toBeTruthy();
    expect(el.querySelector('.app-shell__content')?.textContent).toContain('page content');
  });
});
