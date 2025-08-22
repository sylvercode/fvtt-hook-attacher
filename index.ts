/**
 * Utilities for strongly-typed registration of Foundry VTT hook callbacks.
 */
import { Hooks as HookConfig } from "fvtt-types/src/configuration/index.mjs";

/**
 * Supported hook registration method names mirroring the Foundry `Hooks` API.
 *  - once: fire the callback a single time
 *  - on: persistent listener
 */
export type HookType = "once" | "on";

/**
 * Definition of a standard (non‑deprecated) hook.
 * @template K Hook name constrained to valid, non‑deprecated hook keys.
 */
type HookDefinition<K extends Hooks.HookName> = {
    /** Concrete hook name */
    name: K;
    /** Callback executed when the hook fires */
    callback: Hooks.Function<K>;
    /** Optional hook options (e.g. priority) */
    options?: Hooks.OnOptions
}

/**
 * Definition of a deprecated hook. Kept separate so consumers are explicit when using legacy hooks.
 * @template K Deprecated hook name.
 */
type DeprecatedHookDefinition<K extends keyof HookConfig.DeprecatedHookConfig> = {
    /** Concrete deprecated hook name */
    name: K;
    /** Callback signature pulled from Foundry's deprecated hook config */
    callback: HookConfig.DeprecatedHookConfig[K];
    /** Optional hook options */
    options?: Hooks.OnOptions
}

/**
 * Union type for any valid hook definition, standard or deprecated.
 */
type AnyHookDefinition = HookDefinition<Hooks.HookName> | DeprecatedHookDefinition<keyof HookConfig.DeprecatedHookConfig>;

/**
 * Container mapping a registration method (once/on) to a single or multiple hook definition.
 */
export type HookDefinitions = {
    [K in HookType]?: AnyHookDefinition | AnyHookDefinition[];
};

/**
 * Helper class to attach provided hook definitions to Foundry's global Hooks object.
 *
 * Example:
 * const defs: HookDefinitions = {
 *   once: { name: 'init', callback: () => console.log('Init once') },
 *   on:   [ { name: 'ready', callback: () => console.log('Ready every time A') },
 *           { name: 'ready', callback: () => console.log('Ready every time B') } ]
 * };
 * HooksAttacher.attachHooks(defs);
 */
export class HooksAttacher {
    /**
     * Register each provided hook definition using the corresponding Hooks API method.
     * @param hookDefinitions Mapping of hook method to a hook definition.
     */
    static attachHooks(hookDefinitions: HookDefinitions) {
        for (const [hookName, hookDef] of Object.entries(hookDefinitions)) {
            const hookFunc = Hooks[hookName as HookType] as (a: any, b: any, c: any) => any;
            const hookDefArr = Array.isArray(hookDef) ? hookDef : [hookDef];
            for (const def of hookDefArr) {
                hookFunc.call(Hooks, def.name, def.callback, def.options);
            }
        }
    }
}
