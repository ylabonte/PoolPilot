/// <reference types="astro/client" />

// `@fontsource-variable/*` packages are side-effect CSS imports and ship no type
// declarations, so `astro check` flags them as ts(2882). Declare them as untyped
// modules so the type-check passes (they carry no runtime API we consume).
declare module '@fontsource-variable/*';
