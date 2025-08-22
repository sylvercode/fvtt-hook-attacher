# fvtt-hook-attacher

A small helper to declare hooks and attach them in Foundry VTT.

## Install

- Add [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types) to your module dependency.
- Add `index.ts` to your module (raw copy or git submodule).

## Usage

Define and attach hooks:

```ts
const defs: HookDefinitions = {
  once: { name: 'init', callback: () => console.log('Init once') },
  on:   [ { name: 'ready', callback: () => console.log('Ready every time A') },
          { name: 'ready', callback: () => console.log('Ready every time B') } ]
};

HooksAttacher.attachHooks(defs);
```

### Tips

- Declare each hook near its associated code (e.g., within each component).
- Merge the definitions and attach them once during startup.

```ts
const defs: HookDefinitions = {
  ...ComponentA.HOOKS_DEFINITIONS,
  ...ComponentB.HOOKS_DEFINITIONS,
};
HooksAttacher.attachHooks(defs);
```
