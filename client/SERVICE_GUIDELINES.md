# Shared Service Guidelines

Conventions for services under `core/` and `features/*/`. See
[`BaseApiService`](src/app/core/api/base-api.service.ts) and its consumer,
[`ToolRegistryService`](src/app/features/tools/tool-registry.service.ts), for the pattern in
practice.

## Interface-first design

Define the contract before the class. A consumer, a test double, or a future alternate
implementation should be able to read the interface alone and know everything they need —
without opening the class body.

```ts
// api.service.ts — the contract, defined first
export interface ApiService {
  resourceUrl(path: string): string;
  getResource<T>(
    pathFn: () => string | undefined,
    options?: HttpResourceOptions<T, unknown>,
  ): HttpResourceRef<T | undefined>;
}

// base-api.service.ts — the implementation
@Service()
export class BaseApiService implements ApiService {
  /* ... */
}
```

This isn't ceremony for its own sake: it forces the shape of the API to be settled — what it
does, not how — before any implementation detail (which HTTP client, which caching strategy)
can leak into how consumers think about it. A consumer depends on `ApiService`'s shape; whether
that's satisfied by `BaseApiService` or, in a test, a hand-built stub, doesn't matter to them.

## `providedIn: 'root'` is the default

Use `@Service()` (see [CODING_STANDARDS.md](CODING_STANDARDS.md)) for every service unless
there's a specific, statable reason it needs narrower scope — e.g. state that must reset per
route or per component instance, provided in that route's/component's own `providers` array
instead. "Might want multiple instances someday" is not a reason; add scoping when a real need
shows up, not preemptively.

## Signal vs. Observable

Default to a **signal** (or `resource()`/`httpResource()`, which are signal-backed) for state a
component reads and re-renders from: current config, current theme, the current value of a
fetched resource. This project already does this — `ConfigService.config`, `ThemeService.theme`,
`ToolRegistryService.tools` are all plain signals.

Reach for **RxJS** when the job is genuinely a stream — a sequence of discrete events over time
that needs operators to manage (`debounceTime`, `switchMap`, `merge`, `combineLatest`), not just
a value that changes: a search-as-you-type input, WebSocket messages, orchestrating several
in-flight requests that depend on each other. If you're not reaching for an operator, you
probably want a signal instead of an `Observable`.

**Both can coexist in one service** — e.g. a service that exposes a signal derived from an
internal RxJS pipeline via `toSignal()`. Pick per-value, not per-service.

## `takeUntilDestroyed()`, never a manual `Subscription` bag

Any subscription that needs cleanup uses `takeUntilDestroyed()` — never the
`private subscriptions = new Subscription()` / `ngOnDestroy() { this.subscriptions.unsubscribe(); }`
pattern.

```ts
// Do — inside an injection context (field initializer, constructor)
private readonly destroyRef = inject(DestroyRef);

readonly searchResults = toSignal(
  this.searchTerm$.pipe(
    debounceTime(300),
    switchMap((term) => this.search(term)),
    takeUntilDestroyed(this.destroyRef),
  ),
);
```

```ts
// Not this
private readonly subscriptions = new Subscription();

ngOnInit() {
  this.subscriptions.add(this.searchTerm$.subscribe(...));
}

ngOnDestroy() {
  this.subscriptions.unsubscribe();
}
```

`takeUntilDestroyed()` needs an injection context to resolve its `DestroyRef` automatically (a
field initializer or constructor); called later, pass a `DestroyRef` explicitly. `resource()`/
`httpResource()` handle their own cleanup and don't need this at all — it's specifically for
RxJS subscriptions.

## `BaseApiService`: the one entry point for HTTP

Every service that fetches data over HTTP goes through
[`BaseApiService`](src/app/core/api/base-api.service.ts) (or a future sibling implementing
[`ApiService`](src/app/core/api/api.service.ts)) — never `inject(HttpClient)` or
`httpResource()` directly in a feature service, and never a hand-built
`` `${configService.config.apiBaseUrl}/...` `` string.

Two reasons, not one:

1. **URL construction is centralized.** Every consumer just supplies a path; `BaseApiService`
   is the only place that knows about `ConfigService.apiBaseUrl` (see
   [`ToolRegistryService`](src/app/features/tools/tool-registry.service.ts) — it no longer
   injects `ConfigService` at all).
2. **Nothing bypasses the interceptor chain.** Days 10–12 add HTTP interceptors (logging, error
   handling, loading state) via `provideHttpClient(withInterceptors([...]))` in
   `app.config.ts`. Interceptors apply to every request made through Angular's `HttpClient`
   regardless of which service issues it — but routing every request through one shared method
   is what keeps that true in practice: a future service that calls `HttpClient` directly (even
   though it would still technically hit the interceptors) is a service that's stopped
   following the convention, and the next one copies it. `BaseApiService.getResource()` is the
   one obvious, discoverable way to fetch data, so it's what gets copied instead.

`BaseApiService` stays a thin wrapper — it does not grow speculative methods for HTTP verbs
nothing uses yet. Add `postResource`, mutation helpers, etc. when a real consumer needs them,
matching the interface to actual usage rather than a hypothetical full REST client.
