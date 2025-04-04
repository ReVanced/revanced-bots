// @ts-check

/**
 * @type {import('semantic-release').Options}
 */
const Options = {
    branches: [
        'main',
        {
            name: 'dev',
            prerelease: true,
        },
    ],
    plugins:
        process.env['RELEASE_WORKFLOW_STEP'] !== 'publish'
            ? [
                  [
                      '@semantic-release/commit-analyzer',
                      {
                          releaseRules: [{ type: 'build', scope: 'Needs bump', release: 'patch' }],
                      },
                  ],
                  '@semantic-release/release-notes-generator',
                  '@semantic-release/changelog',
                  [
                      '@semantic-release/npm',
                      {
                          npmPublish: false,
                      },
                  ],
                  [
                      '@semantic-release/git',
                      {
                          assets: ['CHANGELOG.md', 'package.json', '../../bun.lockb'],
                      },
                  ],
                  [
                      '@semantic-release/github',
                      {
                          assets: [
                              {
                                  path: 'dist/*',
                              },
                          ],
                          successComment: false,
                      },
                  ],
                  // This unfortunately has to run multiple times, even though it needs to run only once.
                  [
                      '@saithodev/semantic-release-backmerge',
                      {
                          backmergeBranches: [
                              {
                                  from: 'main',
                                  to: 'dev',
                              },
                          ],
                          clearWorkspace: true,
                      },
                  ],
              ]
            : [],
}

/**
 * @param {import('semantic-release').Options} subprojectOptions
 * @returns {import('semantic-release').Options}
 */
export default function defineSubprojectReleaseConfig(subprojectOptions) {
    return {
        ...Options,
        ...subprojectOptions,
        plugins: [...(subprojectOptions.plugins || []), ...(Options.plugins || [])],
    }
}
