// src/core/utils/polyfills.ts
import { Buffer } from 'buffer';

// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.Buffer = Buffer;
    // @ts-ignore
    window.process = {
        ...(window.process || {}),
        env: {
            ...(window.process?.env || {}),
            NODE_ENV: process.env.NODE_ENV || 'development',
            NODE_DEBUG: process.env.NODE_DEBUG || ''
        },
        version: '',
        nextTick: (fn: Function) => setTimeout(fn, 0)
    };
}
