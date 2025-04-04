import { $ } from 'bun'

const URLEnvironmentVariableName = 'DISCORD_BOT_PORTAINER_WEBHOOK_URL'
await $`INPUT_WEBHOOK_URL=${process.env[URLEnvironmentVariableName]} bun run ../../node_modules/portainer-service-webhook/dist`
