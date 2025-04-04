# 🗣️ Adding auto-responses

This is referring to `config.messageScan`.

## 🧱 Filters

You can add filters to blacklist or whitelist a user from message scanning preventing auto-responses.

### `filter.roles` & `filter.users` & `filter.channels`

Roles, users, and channels which will be affected by the blacklist/whitelist rule.

### `filter.whitelist`

Whether to use whitelist (`true`) or blacklist (`false`) mode.

-   Blacklist mode **will refuse** to scan messages that match any of the filters above
-   Whitelist mode **will only** scan messages that match any of the filters above.

## 💬 Responses

The `responses` field is array containing response configurations. 

### Adding a message response

The `responses[n].response` field contains the embed data that the bot should send. If it is set to `null`, the bot will not send a response or delete the current response if editing (useful for catching false positives).

```ts
response: {
    title: 'Embed title',
    description: 'Embed description',
    fields: [
        {
            name: 'Field name',
            value: 'Field value',
        },
    ],
}

// or if it's a false positive label (for example)
response: null
```

### Adding triggers

A response can be triggered by multiple ways[^1], which can be specified in the `response[n].triggers` object.

You can add a trigger for text messages which can either be a regular expression, or a label match config (NLP) into the `responses.triggers.text` array.  
However, if you want **only OCR results** to match a certain regular expression, you can put them into the `response.triggers.image` array instead.

```ts
triggers: {
    // Text messages
    text: [
        /cool regex/i,
        {
            label: 'some_label',
            threshold: 0.8,
        },
    ],
    // Text messages with image attachments (OCR results)
    image: [
        /image regex/i
    ]
},
```

### Override a filter

You can also override the filter of the current response by supplying the [filter object](#configmessagescanfilter) into the `response.filterOverride` field.

```ts
filterOverride: {
    // will only respond to members with this role
    roles: ['ROLE_ID'],
    // or in this channel
    channels: ['CHANNEL_ID'],
    whitelist: true,
},
```

[^1]: Possible triggers are regular expressions or [label configurations](../config.schema.ts#L83).  
  Label configurations are only allowed for **text scans** currently. However in the future, it may also come for image scans. There is nothing preventing this from happening.

## ⏭️ What's next

The next page will tell you how to run and bundle the bot.

Continue: [🏃🏻‍♂️ Running the bot](./3_running_and_deploying.md)
