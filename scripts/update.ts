/**
 * @fileoverview Scripts to update metadata and types.
 */

import type { PackageInfo } from '../packages/metadata/src/types'
import { existsSync } from 'node:fs'
import { basename, join } from 'node:path'

import { pathToFileURL } from 'node:url'
import fg from 'fast-glob'
import { RULE_ALIAS, RULE_ORIGINAL_ID_MAP } from './update/meta'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, normalizePath, resolveAlias, rulesInSharedConfig, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'

async function readPackages() {
  const RULES_DIR = './packages/eslint-plugin/rules/'

  const ruleDirs = await fg('*', {
    cwd: RULES_DIR,
    onlyDirectories: true,
    absolute: true,
  })

  const rulesMeta = await Promise.all(ruleDirs.map(async (path) => {
    const name = basename(path)
    return {
      path,
      name,
    }
  }))

  async function createPackageInfo(
    pkg: string,
    rules: typeof rulesMeta,
  ): Promise<PackageInfo> {
    const pkgId = '@stylistic'
    const shortId = pkg || 'default'
    const path = `packages/eslint-plugin`

    const resolvedRules = await Promise.all(
      rules
        .map(async (i) => {
          const realName = i.name
          const name = resolveAlias(realName)

          const entry = join(RULES_DIR, name, pkg ? `${name}._${pkg}_.ts` : 'index.ts')
          const url = pathToFileURL(entry).href
          const mod = await import(url)
          const meta = mod.default?.meta
          const originalId = shortId === 'js'
            ? name
            : shortId === 'ts'
              ? `@typescript-eslint/${name}`
              : shortId === 'jsx'
                ? `react/${name}`
                : ''

          const docsBase = join(RULES_DIR, i.name)
          let docs = ''
          for (const suffix of ['.md', '._ts_.md', '._js_.md', '._jsx_.md', '._plus_.md']) {
            if (existsSync(join(docsBase, `README${suffix}`))) {
              docs = join(docsBase, `README${suffix}`)
              break
            }
          }

          return {
            name: realName,
            ruleId: `${pkgId}/${realName}`,
            originalId: RULE_ORIGINAL_ID_MAP[originalId] || originalId,
            entry: normalizePath(entry),
            docsEntry: docs,
            meta: {
              fixable: meta?.fixable,
              docs: {
                description: meta?.docs?.description,
                recommended: rulesInSharedConfig.has(`@stylistic/${realName}`),
              },
            },
          }
        }),
    )

    for (const [alias, source] of Object.entries(RULE_ALIAS)) {
      const rule = resolvedRules.find(i => i.name === source)
      if (rule) {
        resolvedRules.push({
          ...rule,
          name: alias,
          ruleId: `${pkgId}/${alias}`,
        })
      }
    }

    resolvedRules.sort((a, b) => a.name.localeCompare(b.name))

    return {
      name: '@stylistic/eslint-plugin',
      shortId,
      pkgId,
      path,
      rules: resolvedRules,
    }
  }

  const mainPackage = await createPackageInfo('', rulesMeta)

  return [mainPackage]
}

async function run() {
  const packages = await readPackages()

  for (const pkg of packages) {
    await writeRulesIndex(pkg)
    await writeREADME(pkg)
    await writePackageDTS(pkg)
    await generateConfigs(pkg)
    await updateExports(pkg)
  }

  await generateDtsFromSchema()
  await generateMetadata(packages)
}

run()
