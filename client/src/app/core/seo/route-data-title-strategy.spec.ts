import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Routes, TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RouteDataTitleStrategy } from './route-data-title-strategy';

@Component({ selector: 'app-test-page', template: '' })
class TestPage {}

describe('RouteDataTitleStrategy', () => {
  const routes: Routes = [
    {
      path: 'with-data',
      component: TestPage,
      data: { title: 'Test Title', metaDescription: 'Test description' },
    },
    {
      path: 'without-data',
      component: TestPage,
      data: {},
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: TitleStrategy, useClass: RouteDataTitleStrategy },
      ],
    });
  });

  it('sets document title and meta description from route data', async () => {
    await RouterTestingHarness.create('/with-data');

    expect(TestBed.inject(Title).getTitle()).toBe('Test Title');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe('Test description');
  });

  it('leaves the title unchanged when route data has no title', async () => {
    TestBed.inject(Title).setTitle('Unchanged');

    await RouterTestingHarness.create('/without-data');

    expect(TestBed.inject(Title).getTitle()).toBe('Unchanged');
  });
});
