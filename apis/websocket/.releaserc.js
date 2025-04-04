import defineSubprojectReleaseConfig from '../../semantic-release-config.js'

export default defineSubprojectReleaseConfig({
    plugins:
        process.env.RELEASE_WORKFLOW_STEP === 'publish'
            ? [
                  [
                      '@semantic-release/exec',
                      {
                          publishCmd: 'bun run scripts/trigger-portainer-webhook.ts',
                      },
                  ],
              ]
            : [
                  [
                      '@codedependant/semantic-release-docker',
                      {
                          dockerImage: 'revanced-bot-websocket-api',
                          dockerRegistry: 'ghcr.io',
                          dockerProject: 'revanced',
                          dockerContext: '../..',
                          dockerPlatform: ['linux/amd64', 'linux/arm64'],
                          dockerBuildQuiet: false,
                          dockerTags: [
                              '{{#if prerelease.[0]}}dev{{else}}main{{/if}}',
                              '{{#unless prerelease.[0]}}latest{{/unless}}',
                              '{{version}}',
                          ],
                      },
                  ],
              ],
})
