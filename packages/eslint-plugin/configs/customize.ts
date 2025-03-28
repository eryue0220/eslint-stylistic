/* eslint perfectionist/sort-objects: "error" */

import type { Linter } from 'eslint'
import type { StylisticCustomizeOptions } from '../dts/options'
import type { RuleOptions } from '../dts/rule-options'
import plugin from '../src/plugin'

type Rules = Partial<{
  [K in keyof RuleOptions]: Linter.RuleSeverity | [Linter.RuleSeverity, ...RuleOptions[K]]
}>

/**
 * A factory function to customize the recommended config
 */
export function customize(options: StylisticCustomizeOptions = {}): Linter.Config {
  const {
    arrowParens = false,
    blockSpacing = true,
    braceStyle = 'stroustrup',
    commaDangle = 'always-multiline',
    indent = 2,
    jsx = true,
    pluginName = '@stylistic',
    quoteProps = 'consistent-as-needed',
    quotes = 'single',
    semi = false,
  } = options

  let rules: Rules = {
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/arrow-parens': ['error', arrowParens ? 'always' : 'as-needed', { requireForBlockBody: true }],
    '@stylistic/arrow-spacing': ['error', { after: true, before: true }],
    '@stylistic/block-spacing': ['error', blockSpacing ? 'always' : 'never'],
    '@stylistic/brace-style': ['error', braceStyle, { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['error', commaDangle],
    '@stylistic/comma-spacing': ['error', { after: true, before: false }],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/eol-last': 'error',
    '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
    '@stylistic/indent': ['error', indent, {
      ArrayExpression: 1,
      CallExpression: { arguments: 1 },
      flatTernaryExpressions: false,
      FunctionDeclaration: { body: 1, parameters: 1 },
      FunctionExpression: { body: 1, parameters: 1 },
      ignoreComments: false,
      ignoredNodes: [
        'TSUnionType',
        'TSIntersectionType',
        'TSTypeParameterInstantiation',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
      ],
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      offsetTernaryExpressions: true,
      outerIIFEBody: 1,
      SwitchCase: 1,
      tabLength: indent === 'tab' ? 4 : indent,
      VariableDeclarator: 1,
    }],
    '@stylistic/indent-binary-ops': ['error', indent],
    '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
    '@stylistic/keyword-spacing': ['error', { after: true, before: true }],
    '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    '@stylistic/member-delimiter-style': ['error', {
      multiline: {
        delimiter: semi ? 'semi' : 'none',
        requireLast: semi,
      },
      multilineDetection: 'brackets',
      overrides: {
        interface: {
          multiline: {
            delimiter: semi ? 'semi' : 'none',
            requireLast: semi,
          },
        },
      },
      singleline: {
        delimiter: semi ? 'semi' : 'comma',
      },
    }],
    '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-extra-parens': ['error', 'functions'],
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-mixed-operators': ['error', {
      allowSamePrecedence: true,
      groups: [
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
    }],
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/no-tabs': indent === 'tab' ? 'off' : 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/operator-linebreak': ['error', 'before'],
    '@stylistic/padded-blocks': ['error', { blocks: 'never', classes: 'never', switches: 'never' }],
    '@stylistic/quote-props': ['error', quoteProps],
    '@stylistic/quotes': ['error', quotes, { allowTemplateLiterals: true, avoidEscape: false }],
    '@stylistic/rest-spread-spacing': ['error', 'never'],
    '@stylistic/semi': ['error', semi ? 'always' : 'never'],
    '@stylistic/semi-spacing': ['error', { after: true, before: false }],
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': ['error', { nonwords: false, words: true }],
    '@stylistic/spaced-comment': ['error', 'always', {
      block: {
        balanced: true,
        exceptions: ['*'],
        markers: ['!'],
      },
      line: {
        exceptions: ['/', '#'],
        markers: ['/'],
      },
    }],
    '@stylistic/template-curly-spacing': 'error',
    '@stylistic/template-tag-spacing': ['error', 'never'],
    '@stylistic/type-annotation-spacing': ['error', {}],
    '@stylistic/type-generic-spacing': 'error',
    '@stylistic/type-named-tuple-spacing': 'error',
    '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
    '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],

    ...jsx
      ? {
          '@stylistic/jsx-closing-bracket-location': 'error',
          '@stylistic/jsx-closing-tag-location': 'error',
          '@stylistic/jsx-curly-brace-presence': ['error', { propElementValues: 'always' }],
          '@stylistic/jsx-curly-newline': 'error',
          '@stylistic/jsx-curly-spacing': ['error', 'never'],
          '@stylistic/jsx-equals-spacing': 'error',
          '@stylistic/jsx-first-prop-new-line': 'error',
          '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
          '@stylistic/jsx-indent-props': ['error', indent],
          '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
          '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
          '@stylistic/jsx-quotes': 'error',
          '@stylistic/jsx-tag-spacing': [
            'error',
            {
              afterOpening: 'never',
              beforeClosing: 'never',
              beforeSelfClosing: 'always',
              closingSlash: 'never',
            },
          ],
          '@stylistic/jsx-wrap-multilines': [
            'error',
            {
              arrow: 'parens-new-line',
              assignment: 'parens-new-line',
              condition: 'parens-new-line',
              declaration: 'parens-new-line',
              logical: 'parens-new-line',
              prop: 'parens-new-line',
              propertyValue: 'parens-new-line',
              return: 'parens-new-line',
            },
          ],
        }
      : {},
  }

  if (pluginName !== '@stylistic') {
    const regex = /^@stylistic\//
    rules = Object.fromEntries(
      Object.entries(rules!)
        .map(([ruleName, ruleConfig]) => [
          ruleName.replace(regex, `${pluginName}/`),
          ruleConfig,
        ]),
    )
  }

  return {
    plugins: {
      [pluginName]: plugin,
    },
    rules,
  } satisfies Linter.Config
}
