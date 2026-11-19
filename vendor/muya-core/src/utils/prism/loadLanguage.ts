/// <reference types="vite/client" />
import components from 'prismjs/components.js';
import getLoader from 'prismjs/dependencies';

// Resolve the installed package at build time, independent of npm/pnpm hoisting.
const componentImports = import.meta.glob([
    '@muya-prism/prism-*.js',
    '!@muya-prism/prism-*.min.js',
]);

interface ILangLoadStatus {
    lang: string;
    status: 'noexist' | 'cached' | 'loaded';
}
/**
 * The set of all languages which have been loaded using the below function.
 *
 * @type {Set<string>}
 */
export const loadedLanguages = new Set([
    'markup',
    'css',
    'clike',
    'javascript',
]);

const { languages } = components;

// Look for the origin language by alias
export function transformAliasToOrigin(langs: string[]) {
    const result = [];

    for (const lang of langs) {
        if (languages[lang]) {
            result.push(lang);
        }
        else {
            const language = Object.keys(languages).find((name) => {
                const l = languages[name];
                if (l.alias) {
                    return (
                        l.alias === lang
                        || (Array.isArray(l.alias) && l.alias.includes(lang))
                    );
                }

                return false;
            });

            if (language) {
                result.push(language);
            }
            else {
                // The lang is not exist, the will handle in `initLoadLanguage`
                result.push(lang);
            }
        }
    }

    return result;
}

function initLoadLanguage(Prism: any) {
    return async function loadLanguages(langs?: string[] | string) {
    // If no argument is passed, load all components
        if (!langs)
            langs = Object.keys(languages).filter(lang => lang !== 'meta');

        if (langs && !langs.length) {
            return Promise.reject(
                new Error(
                    'The first parameter should be a list of load languages or single language.',
                ),
            );
        }

        if (!Array.isArray(langs))
            langs = [langs];

        const statuses: ILangLoadStatus[] = [];
        // The user might have loaded languages via some other way or used `prism.js` which already includes some
        // We don't need to validate the ids because `getLoader` will ignore invalid ones
        const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)];
        // Prism guarantees getIds() is in dependency load order. Await each
        // component before dependants use its grammar (e.g. C before C++).
        const ids: string[] = getLoader(components, langs, loaded).getIds();
        for (const lang of ids) {
            if (!(lang in components.languages)) {
                statuses.push({
                    lang,
                    status: 'noexist',
                });
            }
            else if (loadedLanguages.has(lang)) {
                statuses.push({
                    lang,
                    status: 'cached',
                });
            }
            else {
                delete Prism.languages[lang];
                const load = Object.entries(componentImports).find(([name]) => name.endsWith(`/prism-${lang}.js`))?.[1];
                if (!load)
                    throw new Error(`Missing installed Prism component: ${lang}`);
                await load();
                statuses.push({
                    lang,
                    status: 'loaded',
                });
                loadedLanguages.add(lang);
            }
        }

        return statuses;
    };
}

export default initLoadLanguage;
