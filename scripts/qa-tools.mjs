/** Optional browser tools may live outside the application dependency tree. */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = process.env.QA_TOOL_ROOT ? createRequire(resolve(process.env.QA_TOOL_ROOT, 'package.json')) : createRequire(import.meta.url);
export const { chromium } = require('playwright');
export const AxeBuilder = require('@axe-core/playwright').default;
export const baseUrl = process.env.PREVIEW_URL ?? 'http://localhost:4175';
