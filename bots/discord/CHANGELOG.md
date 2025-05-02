## @revanced/discord-bot [1.1.3-dev.1](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.1.2...@revanced/discord-bot@1.1.3-dev.1) (2025-05-02)


### Bug Fixes

* **bots/discord:** fix timeout overflow check for role presets ([9d7bd32](https://github.com/revanced/revanced-bots/commit/9d7bd3286ad0ad4bdccda6a6c34788bdc53a8fd4))

## @revanced/discord-bot [1.1.2](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.1.1...@revanced/discord-bot@1.1.2) (2025-04-16)


### Bug Fixes

* **bots/discord/commands/admin/reload:** fix type error ([3908854](https://github.com/revanced/revanced-bots/commit/3908854fe090dda67b0d90225ab76f75e95db4c0))
* **bots/discord/commands/moderation:** check if timeout amount is safe in role-preset commands ([0c1382c](https://github.com/revanced/revanced-bots/commit/0c1382c55856ed1e54c9e53dbb37e9297c5da37c))
* **bots/discord:** replace use of deprecated `options.ephemeral` in replies ([31e5cf7](https://github.com/revanced/revanced-bots/commit/31e5cf7fc5c7cd0c6ca3b1f3b9410a88b95d8273))

## @revanced/discord-bot [1.1.1](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.1.0...@revanced/discord-bot@1.1.1) (2025-04-14)


### Bug Fixes

* **bots/discord:** fix sticky msg force timer always starting, add more logging ([cb4dc42](https://github.com/revanced/revanced-bots/commit/cb4dc42dfab8cf9821b03316cf56b405abd497ae))

# @revanced/discord-bot [1.1.0](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.4...@revanced/discord-bot@1.1.0) (2025-04-14)


### Features

* **bots/discord:** delete and send sticky msg concurrently, add more logging ([247a00f](https://github.com/revanced/revanced-bots/commit/247a00f57fc2a45fe828cc41e6f0e38e67e83a20))

## @revanced/discord-bot [1.0.4](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.3...@revanced/discord-bot@1.0.4) (2025-04-14)


### Bug Fixes

* **bots/discord:** fix sticky messages logic again ([aa7501c](https://github.com/revanced/revanced-bots/commit/aa7501c3097a790265e4ea624d07c4a9c3c1b908))
* **bots/discord:** remove expired presets from db if unapplying is not possible ([9d705e5](https://github.com/revanced/revanced-bots/commit/9d705e580c05d8b25df6f845d3aac747adaca116))

## @revanced/discord-bot [1.0.3](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.2...@revanced/discord-bot@1.0.3) (2025-04-09)


### Bug Fixes

* **bots/discord:** attempt to fix sticky messages one last time ([65288ec](https://github.com/revanced/revanced-bots/commit/65288ec4242b32d0b5e213b3d7af602bb9a829ca))

## @revanced/discord-bot [1.0.2](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.1...@revanced/discord-bot@1.0.2) (2025-04-09)

## @revanced/discord-bot [1.0.1](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.0...@revanced/discord-bot@1.0.1) (2025-04-09)


### Bug Fixes

* **bots/discord:** attempt to fix sticky messages again ([7564b1a](https://github.com/revanced/revanced-bots/commit/7564b1a8f066183df390887ddfd4d73e0baa87ac))

# @revanced/discord-bot 1.0.0 (2025-04-04)


### Bug Fixes

* **bot/discord:** start remove preset timeout for `role-preset` command ([cbf9116](https://github.com/revanced/revanced-bots/commit/cbf91162e27dd4c1ecb976927ab708f1d882abca))
* **bots/discord/commands/eval:** evaluate in current context ([5925d90](https://github.com/revanced/revanced-bots/commit/5925d902095acef5f6396ca03583a9cbb0862498))
* **bots/discord/commands/mute:** use existing `parseDuration` util function' ([3e07429](https://github.com/revanced/revanced-bots/commit/3e07429664f7dbb6ce653083e0adb1a232737fde))
* **bots/discord/commands/unmute:** fix option description and embeds ([7fdf8c0](https://github.com/revanced/revanced-bots/commit/7fdf8c0dc722e21fe5a3ad6ef8d3a306ef85f532))
* **bots/discord/commands:** minor issues ([3b2596e](https://github.com/revanced/revanced-bots/commit/3b2596e748cf2cde1500ef2ded55f0faabc2c272))
* **bots/discord/commands:** refactor and add checks ([a2bf3ea](https://github.com/revanced/revanced-bots/commit/a2bf3eade99b46f9ffb55d45b8caf1bcf3d22a9b))
* **bots/discord/database:** fix schema for role presets ([4aa138a](https://github.com/revanced/revanced-bots/commit/4aa138a9af8db7093ef637470fcfdea1f5341236))
* **bots/discord/scripts/build:** check if dist dir exists before cleaning ([c06033e](https://github.com/revanced/revanced-bots/commit/c06033e5730f82438e8052b9b519a8f8e2d25437))
* **bots/discord/scripts:** unintentional escaping on windows ([09dc706](https://github.com/revanced/revanced-bots/commit/09dc70632da0597fdb26677acee3f6fccbb2b9b5))
* **bots/discord/utils/discord/embeds:** set thumbnail on moderation embeds ([b056291](https://github.com/revanced/revanced-bots/commit/b056291ad0f2e2eac5eec8aa71f15dbc769aa0f9))
* **bots/discord/utils/discord/rolePresets:** correct property access for presets ([4c6ad11](https://github.com/revanced/revanced-bots/commit/4c6ad11be30c1d6af97c4ae40fc62d05fa7bdd57))
* **bots/discord/utils/discord:** add `moderation` module related functions ([7e8270f](https://github.com/revanced/revanced-bots/commit/7e8270f7d260322e1950e058b221ab088bd595d0))
* **bots/discord/utils/duration:** fix empty string returning with duration is 0 ([83c314e](https://github.com/revanced/revanced-bots/commit/83c314ef5f721abc355272db0e4c182dcfe5d943))
* **bots/discord/utils/duration:** fix specified default unit not working ([d138af4](https://github.com/revanced/revanced-bots/commit/d138af46d1f25a11b6f8ab3790ecaa70b1d716a9))
* **bots/discord/utils/duration:** make second the default unit ([5d1af3c](https://github.com/revanced/revanced-bots/commit/5d1af3c31c3379b6a13684dfb07583737908c8aa))
* **bots/discord:** add GuildMember partial ([8e3946a](https://github.com/revanced/revanced-bots/commit/8e3946a66602838715787090008c7bfaf72b67e9))
* **bots/discord:** allow access to `context` in `/eval` and await result ([99f65f0](https://github.com/revanced/revanced-bots/commit/99f65f07f5f8830c6e8ea4ae171e986af4d3f1f6))
* **bots/discord:** always true check causing no messages to be scanned ([98ec37b](https://github.com/revanced/revanced-bots/commit/98ec37b5d18cade85270ab83b0ed0abe41244dd9))
* **bots/discord:** apply active role presets if members rejoin ([f50b26b](https://github.com/revanced/revanced-bots/commit/f50b26b82d66c88fd1dbb8c07d77c177c0e781df))
* **bots/discord:** attempt to fix stuck sticky message timeouts ([3ed5bd1](https://github.com/revanced/revanced-bots/commit/3ed5bd11acc3b4fbd57b0d632c68eb9f77365b8a))
* **bots/discord:** await when putting entries into db ([4da6175](https://github.com/revanced/revanced-bots/commit/4da6175cf58b1fa6144bdc71ec806766d32c1025))
* **bots/discord:** broken regex when prefix set to special characters ([ab62e55](https://github.com/revanced/revanced-bots/commit/ab62e55e76005f5999d7413d1158e54053f28d1f))
* **bots/discord:** check token before connecting to bot api ([f3e4408](https://github.com/revanced/revanced-bots/commit/f3e4408aa28fb6a9d21365af8c1bea3d07b481de))
* **bots/discord:** ci issues causing database to not be auto generated ([673aa18](https://github.com/revanced/revanced-bots/commit/673aa189bef1009a3e32ba3b1291a5ee84f2def3))
* **bots/discord:** clear role presets after they expire ([faa81f4](https://github.com/revanced/revanced-bots/commit/faa81f4d887eaeae809651f5b68187d033a260f2))
* **bots/discord:** connect to discord API even if initial bot API connection fails ([6658b58](https://github.com/revanced/revanced-bots/commit/6658b582dbeba7e072a7a04c4efa255e7f634aef))
* **bots/discord:** contextify object before sandboxing ([062735f](https://github.com/revanced/revanced-bots/commit/062735f6d552890404d6192244c51a11b0709580))
* **bots/discord:** correct permission check logic ([dd8872c](https://github.com/revanced/revanced-bots/commit/dd8872c027c7e7e1a00f38d659b4d6e79274238c))
* **bots/discord:** correct sticky messages logic ([de8bef6](https://github.com/revanced/revanced-bots/commit/de8bef6520d53a1299f0478458320a7eb75c5e1d))
* **bots/discord:** correct timer active condition for sticky messages ([96065ff](https://github.com/revanced/revanced-bots/commit/96065ff17584ff99a56ca5008327863ca5a7852b))
* **bots/discord:** correct whitelist logic ([49c29be](https://github.com/revanced/revanced-bots/commit/49c29bebfbe348ae4e2cc1b3a83bfa41eb26ccd1))
* **bots/discord:** cross-device link build errors ([38c0699](https://github.com/revanced/revanced-bots/commit/38c06997b4d0f7bb3f1e62618a5e3f088c522e30))
* **bots/discord:** decrease length of an option in `ban` command ([22d3eea](https://github.com/revanced/revanced-bots/commit/22d3eea88d532792c1237d1a1ab18bc02e57816a))
* **bots/discord:** delete expired appliedPresets entries after unapplying ([14c98e8](https://github.com/revanced/revanced-bots/commit/14c98e87df1ec4fd762bbc48ca4c06470cb110a2))
* **bots/discord:** deployment runtime errors due to minification ([a60c60c](https://github.com/revanced/revanced-bots/commit/a60c60c0f994a4c256b7d0582e99a1731209cf49))
* **bots/discord:** do decancer after resetting nickname ([0303fe3](https://github.com/revanced/revanced-bots/commit/0303fe3e367c07e92f831365d5548ca5b03435b2))
* **bots/discord:** do not remove unrelated reactions ([031fd26](https://github.com/revanced/revanced-bots/commit/031fd26b2619ecafeff3964e50accacb87de6108))
* **bots/discord:** don't refresh timer if force timer is active for sticky messages ([4abac0c](https://github.com/revanced/revanced-bots/commit/4abac0c890c0548e14cb56723cae919353a8e726))
* **bots/discord:** filter out text triggers correctly from image-only scans ([8c0dd67](https://github.com/revanced/revanced-bots/commit/8c0dd67d03d5a1747993da08a5bf82a39de43789))
* **bots/discord:** fix freeze on prod builds ([8efb549](https://github.com/revanced/revanced-bots/commit/8efb549453a04fab1ac6414a7f7f8bf702df3c93))
* **bots/discord:** fix get response logic ([3261294](https://github.com/revanced/revanced-bots/commit/3261294822b0a9faec094536ed5be2d3e1d5e17b))
* **bots/discord:** fix reload not working ([11582d5](https://github.com/revanced/revanced-bots/commit/11582d50345cae9fb645a65ca4e621596de6a408))
* **bots/discord:** follow-up if reply is already sent when error ([f75060b](https://github.com/revanced/revanced-bots/commit/f75060bc9cda44902cf872def73c116a6df039d7))
* **bots/discord:** give only removed roles for role presets ([522ad28](https://github.com/revanced/revanced-bots/commit/522ad28fd83565e9ca411dbce86c8447574288fd))
* **bots/discord:** hanging process when disconnecting from API too many times ([d31616e](https://github.com/revanced/revanced-bots/commit/d31616ebcba6f1dcd8bde183bcb8d1adb1501b61))
* **bots/discord:** import `config` from context ([763ef25](https://github.com/revanced/revanced-bots/commit/763ef253f9d4ff70a8b79969a7f4f41cba7f3c59))
* **bots/discord:** make `/eval` work ([eaa25f2](https://github.com/revanced/revanced-bots/commit/eaa25f2eb58a9e2d25bb98633ad668485e099714))
* **bots/discord:** messed up file name for `unmute` command ([399dca7](https://github.com/revanced/revanced-bots/commit/399dca71538fe5c8831977694a97058254a17578))
* **bots/discord:** only check for member permissions when specified while correcting responses ([b79a1c7](https://github.com/revanced/revanced-bots/commit/b79a1c7575e94c3e62654c87775cac497be4a50a))
* **bots/discord:** open database as read-write ([c366840](https://github.com/revanced/revanced-bots/commit/c36684091dddf67880505dc459e4334a8a5492f4))
* **bots/discord:** owners cannot bypass checks on some commands ([39cba97](https://github.com/revanced/revanced-bots/commit/39cba973418027ba6ed67e1ae5ab5c6458807562))
* **bots/discord:** parse larger units of durations, fix wrong timestamp in mod embed ([6c8dce0](https://github.com/revanced/revanced-bots/commit/6c8dce059366a6ef85f5b8b1794c056515b9f5b6))
* **bots/discord:** persist changes in context for eval command ([5b4965d](https://github.com/revanced/revanced-bots/commit/5b4965dcc7285676b2b3b6756c249bd56eaf8485))
* **bots/discord:** provide discord token for `reload` command ([dd21a5a](https://github.com/revanced/revanced-bots/commit/dd21a5abad560f3d00b8c58912786d4b6bd520e9))
* **bots/discord:** remove auto-generated files ([fb8af00](https://github.com/revanced/revanced-bots/commit/fb8af008661bf37389e01cba19d64a8b4fc82139))
* **bots/discord:** remove bad text channel checks ([f5939e2](https://github.com/revanced/revanced-bots/commit/f5939e25288fea2022fdeec9085ecb9ffada6111))
* **bots/discord:** remove redundant footer for response embeds ([412e003](https://github.com/revanced/revanced-bots/commit/412e00317d1eaca23e9c1375e16f94a5f2fa8d86))
* **bots/discord:** remove usage of macros ([7f27c56](https://github.com/revanced/revanced-bots/commit/7f27c5607ceeeef56d67097e88f68caa1b8791b3))
* **bots/discord:** remove useless feature ([d830e48](https://github.com/revanced/revanced-bots/commit/d830e48bc2de7aa457eab3a5f96ae652a93178f9))
* **bots/discord:** replace duration parser with a library ([94c4fed](https://github.com/revanced/revanced-bots/commit/94c4fedc06e20051e4123508e3134b97eb84782a))
* **bots/discord:** reset counter when reconnected to api, redo message scan filter logic ([d234d79](https://github.com/revanced/revanced-bots/commit/d234d79310caed9c43e14a905f9ef46a110e071d))
* **bots/discord:** revert dist denesting, fixes config not found ([0d4898d](https://github.com/revanced/revanced-bots/commit/0d4898dae8b26f8466d3f6b8f62875866f581644))
* **bots/discord:** send right response for after regexes ([a7688fa](https://github.com/revanced/revanced-bots/commit/a7688fa9b91919a87f74071b502cd0a87cd1c1fa))
* **bots/discord:** set the `label` property correctly for message scans ([6d463df](https://github.com/revanced/revanced-bots/commit/6d463df586dee5dd8fe8d6cff1c5316f7809b32a))
* **bots/discord:** set timeout for eligible mutes to unmute faster ([1f5c5a9](https://github.com/revanced/revanced-bots/commit/1f5c5a92a639973b83a1204355538936e69a4454))
* **bots/discord:** some configuration values not applying after running `/reload` ([a976dd2](https://github.com/revanced/revanced-bots/commit/a976dd2accc4b74914651245acde0979c30c92f5))
* **bots/discord:** use `APIEmbed` for response config ([35b9448](https://github.com/revanced/revanced-bots/commit/35b944800a3943c187d5b0e0d3e465ad7d2056fe))
* **bots/discord:** use env for initializing database ([af3759c](https://github.com/revanced/revanced-bots/commit/af3759caf428fada3b3f4a51852543d6fb280018))
* **bots/discord:** wrong command file path being imported ([fa0159c](https://github.com/revanced/revanced-bots/commit/fa0159c3a8dd4dad8778ccdb75b9e7c02ebbb64f))
* **bots/discord:** wrong database schema path ([875bd20](https://github.com/revanced/revanced-bots/commit/875bd209b252566414bf89349839cabc01697e1c))
* config file not being read ([474a8be](https://github.com/revanced/revanced-bots/commit/474a8be4af4eb2bae6e80a893439d846ad4f7503))
* **discord-bot:** also execute slash commands ([f0d45b2](https://github.com/revanced/revanced-bots/commit/f0d45b2c926ed753e2d21f2e06e24d7e6c43880a))
* **discord-bot:** check for role position ([d332043](https://github.com/revanced/revanced-bots/commit/d332043b1a4bb7ac9698a2fc912832e184130b4b))
* **discord-bot:** check if the member has the role ([9bff68c](https://github.com/revanced/revanced-bots/commit/9bff68c8c40c692764e4dec15a058e35059efbc9))
* **discord-bot:** not executing slash commands ([aa08087](https://github.com/revanced/revanced-bots/commit/aa0808768b90844c5fbd3e75d9f2d01c723b0151))
* **discord-bot:** only send lowercased text ([7803758](https://github.com/revanced/revanced-bots/commit/78037580dc92883f5ca21157e45268850cb5db90))
* dislike button not working properly ([85eba55](https://github.com/revanced/revanced-bots/commit/85eba554247738066af72a8efd0de215ec1164dc))
* fix deprecation ([4373ede](https://github.com/revanced/revanced-bots/commit/4373ede855333f209676551162a525238656e1f8))
* fix the fiter for the interaction collector ([a9ff003](https://github.com/revanced/revanced-bots/commit/a9ff00394a73f68a6793c2b35ff184675ee5a72c))
* fix typings and formatting ([479812e](https://github.com/revanced/revanced-bots/commit/479812e199b52cdb295a5746e0767306afab3413))
* ignore message if there's no content ([3cbebc2](https://github.com/revanced/revanced-bots/commit/3cbebc284277808495e64cf0fb47c555924ad9c5))
* move modules to `/bots` ([cd7156e](https://github.com/revanced/revanced-bots/commit/cd7156e792e65777ad1ab5a6f5d828b9ef6a9754))
* other small issues ([bc437a5](https://github.com/revanced/revanced-bots/commit/bc437a5ec7ce1d339094d608e2a61ac5f460c163))
* run projects with `--bun` ([bb2182e](https://github.com/revanced/revanced-bots/commit/bb2182e707fa40c555d56138972eeea28f1b3cf9))
* trainAI not using the bin location ([bd29943](https://github.com/revanced/revanced-bots/commit/bd2994388bc65f720120ef49edb6ba8163260309))
* update repo url ([a21aa34](https://github.com/revanced/revanced-bots/commit/a21aa348d7f32cd0ee65b371e9594520c0a9d3f1))


### chore

* fix more build issues ([77fefb9](https://github.com/revanced/revanced-bots/commit/77fefb9bef286a22f40a4d76b79c64fcc5a2467f))


### Features

* add wit.ai support ([1909e2c](https://github.com/revanced/revanced-bots/commit/1909e2c42148d635dcd045c738d88f65c8be16e3))
* **bots/discord/commands/reply:** send stacktrace when failed ([9f1ac37](https://github.com/revanced/revanced-bots/commit/9f1ac379276c11da65235577a9c6717e01cb02eb))
* **bots/discord/commands:** add `ban` and `unban` commands ([dc4863d](https://github.com/revanced/revanced-bots/commit/dc4863dc208b3fede4d4def323306ab58daffe04))
* **bots/discord/commands:** add `eval` command ([e64d1da](https://github.com/revanced/revanced-bots/commit/e64d1da00cc2ba718da5a4b0da141fe86a0e48d2))
* **bots/discord/commands:** add `mute` and `unmute` commands ([c0fa2fe](https://github.com/revanced/revanced-bots/commit/c0fa2fe1c36acdc7c52cde277aa7da867065f55e))
* **bots/discord/commands:** add `purge` and `role-preset` commands ([fb01ce5](https://github.com/revanced/revanced-bots/commit/fb01ce57400130c93751a11573eb444c0ba103eb))
* **bots/discord/commands:** add `reload` command ([6875b32](https://github.com/revanced/revanced-bots/commit/6875b32fd0c6ce3034da9dc6c704d425afb26f2e))
* **bots/discord/commands:** allow process exception in `exception-test` ([ca47535](https://github.com/revanced/revanced-bots/commit/ca475356ad95fec86e8e8b5bf4bbf17b70add5fe))
* **bots/discord/utils/discord/embeds:** expose `applyCommonEmbedStyles` fn ([2d794ed](https://github.com/revanced/revanced-bots/commit/2d794ede7d7a208bd3616c45e8e6d2a2cd83e9ed))
* **bots/discord/utils/embeds:** make title parameter nullable ([ee885ca](https://github.com/revanced/revanced-bots/commit/ee885ca7585a55fdc31e137ae29dc13a37ce2fb2))
* **bots/discord/utils/fs:** use `recursive` option for listing files ([da21e1a](https://github.com/revanced/revanced-bots/commit/da21e1a6f76deaeb477203b04263bd170863825b))
* **bots/discord/utils:** add duration utility ([a9add9e](https://github.com/revanced/revanced-bots/commit/a9add9ea9affb42bdfcb17cf4b268feec5729854))
* **bots/discord/utils:** add functions for role presets ([fb32a04](https://github.com/revanced/revanced-bots/commit/fb32a04ad38be8d0836dc99259b6ef05a0825830))
* **bots/discord/utils:** allow loading commands from custom dir ([8b690b8](https://github.com/revanced/revanced-bots/commit/8b690b879bb5c6023c8fc863afbd9fd1d02719bb))
* **bots/discord:** add `api.disconnectRetryInterval` config ([2f86586](https://github.com/revanced/revanced-bots/commit/2f8658617923c07f6847cbf1fdfc5f5379d95b6c))
* **bots/discord:** add `moderation.roles` config to be used in `moderation` commands ([39d5b3a](https://github.com/revanced/revanced-bots/commit/39d5b3a479b4d856aabe12cc31177c24f88ae23e))
* **bots/discord:** add `ocrTriggers` resp config, embed footer scan mode ([744a56a](https://github.com/revanced/revanced-bots/commit/744a56a4fdc8844e37959a88bcf81ee39fe726ef))
* **bots/discord:** add `replyToReplied` option in response config ([27662ed](https://github.com/revanced/revanced-bots/commit/27662ed91a79bfac7d3f091834e859a7b57366ce))
* **bots/discord:** add `train` commands ([ee90ef2](https://github.com/revanced/revanced-bots/commit/ee90ef247b4bf2b3c0698606b947116f2dc1b868))
* **bots/discord:** add a better way to manage databases ([a68d726](https://github.com/revanced/revanced-bots/commit/a68d72687584332587455962b0202a306288057d))
* **bots/discord:** add code to actually scan text files correctly ([80aeb19](https://github.com/revanced/revanced-bots/commit/80aeb1902063140a2e78cfaed9424e5101ab03f1))
* **bots/discord:** add default durations for moderation commands ([27d3b39](https://github.com/revanced/revanced-bots/commit/27d3b392092141a1e3b4b0298131ff7817458dc1))
* **bots/discord:** add more fallbacks for decancering ([2e1e009](https://github.com/revanced/revanced-bots/commit/2e1e009b4272495798313bd3bd61f258875c62e1))
* **bots/discord:** add more month aliases to duration parser ([c2009ca](https://github.com/revanced/revanced-bots/commit/c2009ca6d42e4387bc5f375d76ecf72991b7fe32))
* **bots/discord:** add more options for curing, fix default regex ([1a4ec1e](https://github.com/revanced/revanced-bots/commit/1a4ec1ece80becd9156582cc490f6681cb2a1f39))
* **bots/discord:** add source ([f9d50a0](https://github.com/revanced/revanced-bots/commit/f9d50a0a6bef8beaa428a0a555bfa4f879f685f1))
* **bots/discord:** add sticky messages ([bf66155](https://github.com/revanced/revanced-bots/commit/bf661556e131bf0ef24e47f658fbcd701960e312))
* **bots/discord:** add trigger to context for eval ([b5f4097](https://github.com/revanced/revanced-bots/commit/b5f40975386677ffff343c42f8ffac21f847a0b7))
* **bots/discord:** allow admins to bypass permission checks ([620f933](https://github.com/revanced/revanced-bots/commit/620f9339f0737b79d72c66d90ffa42ea3f987710))
* **bots/discord:** blacklist and whitelist for filters ([cdb6001](https://github.com/revanced/revanced-bots/commit/cdb600195520dba33110c40841629259e317055e))
* **bots/discord:** cure on every event ([8ff6086](https://github.com/revanced/revanced-bots/commit/8ff6086028132cc4b49ee60846e8d6ef909f5a89))
* **bots/discord:** don't nest builds in src directory, autogen db when missing ([4834685](https://github.com/revanced/revanced-bots/commit/48346851864c4d4b6276388644dd24ce16222b3e))
* **bots/discord:** framework changes and new features ([646ec8d](https://github.com/revanced/revanced-bots/commit/646ec8da87617e6c8f48a89e8054e2cba91da549))
* **bots/discord:** improve admin commands ([0346741](https://github.com/revanced/revanced-bots/commit/03467411882b8598e2c06f389a09ef2e201bb43f))
* **bots/discord:** improve logs ([6abb740](https://github.com/revanced/revanced-bots/commit/6abb7409945c10bd3af451fb45ef4b4d4ebe9489))
* **bots/discord:** sanitize `BasicDatabase` inputs ([fd76e0a](https://github.com/revanced/revanced-bots/commit/fd76e0af72fe28b414ae3b5e8d3886e58561e57e))
* **bots/discord:** support nickname decancering ([1723e8c](https://github.com/revanced/revanced-bots/commit/1723e8cacf96e8c6bdee22cfd30e89524fdcef74))
* **bots/discord:** switch to `drizzle-orm` ([e204b7b](https://github.com/revanced/revanced-bots/commit/e204b7b7566fd7fa423baef32977a8575d44a9e0))
* **bots/discord:** update config ([197d2ac](https://github.com/revanced/revanced-bots/commit/197d2acea89c38e43858d52736508d449152e804))
* **bots/discord:** update example config file ([bc9951c](https://github.com/revanced/revanced-bots/commit/bc9951c9b5e007c3e1b3076aa0966ccf29bb18bc))
* **bots/discord:** update to newer command definition framework ([97f2795](https://github.com/revanced/revanced-bots/commit/97f2795df4ede4d12a08193dba453c1bc765a4c2))
* discord bot scanning messages ([d1bd3b2](https://github.com/revanced/revanced-bots/commit/d1bd3b2b7e4985a64e9b070ab006cc6f3508c46e))
* **discord-bot:** a way to train AI ([355a508](https://github.com/revanced/revanced-bots/commit/355a50803adc85b5579155b55ddbba4fa0449237))
* **discord-bot:** command handler and train cmd ([6aee8a4](https://github.com/revanced/revanced-bots/commit/6aee8a4c63eb108800fcb0a23ca61f200d8f1f2a))
* **discord-bot:** event handler ([0ad5ece](https://github.com/revanced/revanced-bots/commit/0ad5ece08593c0db111fa4a592b42c6e0348fd1c))
* GODEL AI ([0ba525c](https://github.com/revanced/revanced-bots/commit/0ba525c4a5802106d582c75f713728accf2f151a))
* initalize discord bot ([bb4a5a7](https://github.com/revanced/revanced-bots/commit/bb4a5a77eefbc7ac88536f73a111df1050b235e7))
* initialize helper client ([7f9ca77](https://github.com/revanced/revanced-bots/commit/7f9ca77e0331ec143160ee51ed7c3aa9e4e70b9c))
* message buttons for training ([6551ca9](https://github.com/revanced/revanced-bots/commit/6551ca9dadc2e3ddfe98875e80ed61f7d71a1651))
* platform specific responses ([18e57b0](https://github.com/revanced/revanced-bots/commit/18e57b0c320732a937bb60db11c5d6794ed11522))
* prettier and eslint ([1c27ccb](https://github.com/revanced/revanced-bots/commit/1c27ccb17c85f0f6982db45de426181d2c231d0e))
* refactor and new features ([#7](https://github.com/revanced/revanced-bots/issues/7)) ([8b9f45d](https://github.com/revanced/revanced-bots/commit/8b9f45dc22de29dc2ccb1cfab9a026db00457e25))
* run bots in one process ([d26d533](https://github.com/revanced/revanced-bots/commit/d26d53317440c64fb775cea609a87d29be6c8b40))
* training and replies changed ([715aa91](https://github.com/revanced/revanced-bots/commit/715aa918cf84213c9b19591a398d7532eb3f232a))
* **utils/discord/embeds:** allow adding extra fields for moderation embeds ([49ce9a7](https://github.com/revanced/revanced-bots/commit/49ce9a7ca3d8558b73a9b94dfe7a01d809db6fff))


### BREAKING CHANGES

* In `@revanced/discord-bot`, its environment variable
                 `DATABASE_URL` has been renamed to `DATABASE_PATH`
                 and the `file:` prefix is no longer needed

# @revanced/discord-bot [1.0.0-dev.38](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.0-dev.37...@revanced/discord-bot@1.0.0-dev.38) (2025-04-04)


### Bug Fixes

* run projects with `--bun` ([bb2182e](https://github.com/revanced/revanced-bots/commit/bb2182e707fa40c555d56138972eeea28f1b3cf9))

# @revanced/discord-bot [1.0.0-dev.37](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.0-dev.36...@revanced/discord-bot@1.0.0-dev.37) (2025-03-08)


### Bug Fixes

* **bots/discord/utils/duration:** fix specified default unit not working ([d138af4](https://github.com/revanced/revanced-bots/commit/d138af46d1f25a11b6f8ab3790ecaa70b1d716a9))

# @revanced/discord-bot [1.0.0-dev.36](https://github.com/revanced/revanced-bots/compare/@revanced/discord-bot@1.0.0-dev.35...@revanced/discord-bot@1.0.0-dev.36) (2025-03-03)


### Bug Fixes

* **bots/discord/scripts/build:** check if dist dir exists before cleaning ([c06033e](https://github.com/revanced/revanced-bots/commit/c06033e5730f82438e8052b9b519a8f8e2d25437))
* **bots/discord/utils/duration:** make second the default unit ([5d1af3c](https://github.com/revanced/revanced-bots/commit/5d1af3c31c3379b6a13684dfb07583737908c8aa))
* **bots/discord:** add GuildMember partial ([8e3946a](https://github.com/revanced/revanced-bots/commit/8e3946a66602838715787090008c7bfaf72b67e9))
* **bots/discord:** decrease length of an option in `ban` command ([22d3eea](https://github.com/revanced/revanced-bots/commit/22d3eea88d532792c1237d1a1ab18bc02e57816a))
* **bots/discord:** delete expired appliedPresets entries after unapplying ([14c98e8](https://github.com/revanced/revanced-bots/commit/14c98e87df1ec4fd762bbc48ca4c06470cb110a2))
* fix typings and formatting ([479812e](https://github.com/revanced/revanced-bots/commit/479812e199b52cdb295a5746e0767306afab3413))
* update repo url ([a21aa34](https://github.com/revanced/revanced-bots/commit/a21aa348d7f32cd0ee65b371e9594520c0a9d3f1))


### Features

* **bots/discord:** add more month aliases to duration parser ([c2009ca](https://github.com/revanced/revanced-bots/commit/c2009ca6d42e4387bc5f375d76ecf72991b7fe32))

# @revanced/discord-bot [1.0.0-dev.35](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.34...@revanced/discord-bot@1.0.0-dev.35) (2024-10-17)


### Bug Fixes

* **bots/discord:** fix freeze on prod builds ([8efb549](https://github.com/revanced/revanced-helper/commit/8efb549453a04fab1ac6414a7f7f8bf702df3c93))

# @revanced/discord-bot [1.0.0-dev.34](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.33...@revanced/discord-bot@1.0.0-dev.34) (2024-10-17)


### Bug Fixes

* **bots/discord:** attempt to fix stuck sticky message timeouts ([3ed5bd1](https://github.com/revanced/revanced-helper/commit/3ed5bd11acc3b4fbd57b0d632c68eb9f77365b8a))
* **bots/discord:** fix reload not working ([11582d5](https://github.com/revanced/revanced-helper/commit/11582d50345cae9fb645a65ca4e621596de6a408))


### Features

* **bots/discord:** add default durations for moderation commands ([27d3b39](https://github.com/revanced/revanced-helper/commit/27d3b392092141a1e3b4b0298131ff7817458dc1))
* **bots/discord:** cure on every event ([8ff6086](https://github.com/revanced/revanced-helper/commit/8ff6086028132cc4b49ee60846e8d6ef909f5a89))

# @revanced/discord-bot [1.0.0-dev.33](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.32...@revanced/discord-bot@1.0.0-dev.33) (2024-09-25)


### Features

* **bots/discord:** add trigger to context for eval ([b5f4097](https://github.com/revanced/revanced-helper/commit/b5f40975386677ffff343c42f8ffac21f847a0b7))

# @revanced/discord-bot [1.0.0-dev.32](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.31...@revanced/discord-bot@1.0.0-dev.32) (2024-09-25)


### Bug Fixes

* **bots/discord:** contextify object before sandboxing ([062735f](https://github.com/revanced/revanced-helper/commit/062735f6d552890404d6192244c51a11b0709580))

# @revanced/discord-bot [1.0.0-dev.31](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.30...@revanced/discord-bot@1.0.0-dev.31) (2024-09-25)


### Bug Fixes

* **bots/discord:** persist changes in context for eval command ([5b4965d](https://github.com/revanced/revanced-helper/commit/5b4965dcc7285676b2b3b6756c249bd56eaf8485))

# @revanced/discord-bot [1.0.0-dev.30](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.29...@revanced/discord-bot@1.0.0-dev.30) (2024-09-24)


### Features

* **bots/discord:** improve admin commands ([0346741](https://github.com/revanced/revanced-helper/commit/03467411882b8598e2c06f389a09ef2e201bb43f))

# @revanced/discord-bot [1.0.0-dev.29](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.28...@revanced/discord-bot@1.0.0-dev.29) (2024-09-21)


### Bug Fixes

* **bots/discord:** fix get response logic ([3261294](https://github.com/revanced/revanced-helper/commit/3261294822b0a9faec094536ed5be2d3e1d5e17b))

# @revanced/discord-bot [1.0.0-dev.28](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.27...@revanced/discord-bot@1.0.0-dev.28) (2024-09-20)


### Bug Fixes

* **bots/discord:** don't refresh timer if force timer is active for sticky messages ([4abac0c](https://github.com/revanced/revanced-helper/commit/4abac0c890c0548e14cb56723cae919353a8e726))
* **bots/discord:** filter out text triggers correctly from image-only scans ([8c0dd67](https://github.com/revanced/revanced-helper/commit/8c0dd67d03d5a1747993da08a5bf82a39de43789))

# @revanced/discord-bot [1.0.0-dev.27](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.26...@revanced/discord-bot@1.0.0-dev.27) (2024-09-05)


### Bug Fixes

* **bots/discord:** correct permission check logic ([dd8872c](https://github.com/revanced/revanced-helper/commit/dd8872c027c7e7e1a00f38d659b4d6e79274238c))
* **bots/discord:** give only removed roles for role presets ([522ad28](https://github.com/revanced/revanced-helper/commit/522ad28fd83565e9ca411dbce86c8447574288fd))
* **bots/discord:** replace duration parser with a library ([94c4fed](https://github.com/revanced/revanced-helper/commit/94c4fedc06e20051e4123508e3134b97eb84782a))

# @revanced/discord-bot [1.0.0-dev.27](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.26...@revanced/discord-bot@1.0.0-dev.27) (2024-08-23)


### Bug Fixes

* **bots/discord:** give only removed roles for role presets ([522ad28](https://github.com/revanced/revanced-helper/commit/522ad28fd83565e9ca411dbce86c8447574288fd))
* **bots/discord:** replace duration parser with a library ([94c4fed](https://github.com/revanced/revanced-helper/commit/94c4fedc06e20051e4123508e3134b97eb84782a))

# @revanced/discord-bot [1.0.0-dev.26](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.25...@revanced/discord-bot@1.0.0-dev.26) (2024-08-15)


### Bug Fixes

* **bots/discord:** correct timer active condition for sticky messages ([96065ff](https://github.com/revanced/revanced-helper/commit/96065ff17584ff99a56ca5008327863ca5a7852b))

# @revanced/discord-bot [1.0.0-dev.25](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.24...@revanced/discord-bot@1.0.0-dev.25) (2024-08-15)


### Bug Fixes

* **bots/discord:** allow access to `context` in `/eval` and await result ([99f65f0](https://github.com/revanced/revanced-helper/commit/99f65f07f5f8830c6e8ea4ae171e986af4d3f1f6))

# @revanced/discord-bot [1.0.0-dev.24](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.23...@revanced/discord-bot@1.0.0-dev.24) (2024-08-14)


### Bug Fixes

* **bots/discord:** do not remove unrelated reactions ([031fd26](https://github.com/revanced/revanced-helper/commit/031fd26b2619ecafeff3964e50accacb87de6108))

# @revanced/discord-bot [1.0.0-dev.23](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.22...@revanced/discord-bot@1.0.0-dev.23) (2024-08-13)


### Features

* **bots/discord:** add `train` commands ([ee90ef2](https://github.com/revanced/revanced-helper/commit/ee90ef247b4bf2b3c0698606b947116f2dc1b868))
* **bots/discord:** update to newer command definition framework ([97f2795](https://github.com/revanced/revanced-helper/commit/97f2795df4ede4d12a08193dba453c1bc765a4c2))

# @revanced/discord-bot [1.0.0-dev.22](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.21...@revanced/discord-bot@1.0.0-dev.22) (2024-08-10)


### Bug Fixes

* **bots/discord:** parse larger units of durations, fix wrong timestamp in mod embed ([6c8dce0](https://github.com/revanced/revanced-helper/commit/6c8dce059366a6ef85f5b8b1794c056515b9f5b6))
* **bots/discord:** provide discord token for `reload` command ([dd21a5a](https://github.com/revanced/revanced-helper/commit/dd21a5abad560f3d00b8c58912786d4b6bd520e9))


### Features

* **bots/discord:** add code to actually scan text files correctly ([80aeb19](https://github.com/revanced/revanced-helper/commit/80aeb1902063140a2e78cfaed9424e5101ab03f1))

# @revanced/discord-bot [1.0.0-dev.21](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.20...@revanced/discord-bot@1.0.0-dev.21) (2024-08-04)


### Bug Fixes

* **bots/discord:** correct sticky messages logic ([de8bef6](https://github.com/revanced/revanced-helper/commit/de8bef6520d53a1299f0478458320a7eb75c5e1d))
* **bots/discord:** make `/eval` work ([eaa25f2](https://github.com/revanced/revanced-helper/commit/eaa25f2eb58a9e2d25bb98633ad668485e099714))
* **bots/discord:** some configuration values not applying after running `/reload` ([a976dd2](https://github.com/revanced/revanced-helper/commit/a976dd2accc4b74914651245acde0979c30c92f5))

# @revanced/discord-bot [1.0.0-dev.20](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.19...@revanced/discord-bot@1.0.0-dev.20) (2024-08-03)


### Bug Fixes

* **bots/discord:** await when putting entries into db ([4da6175](https://github.com/revanced/revanced-helper/commit/4da6175cf58b1fa6144bdc71ec806766d32c1025))

# @revanced/discord-bot [1.0.0-dev.19](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.18...@revanced/discord-bot@1.0.0-dev.19) (2024-08-03)


### Bug Fixes

* **bots/discord:** correct whitelist logic ([49c29be](https://github.com/revanced/revanced-helper/commit/49c29bebfbe348ae4e2cc1b3a83bfa41eb26ccd1))

# @revanced/discord-bot [1.0.0-dev.18](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.17...@revanced/discord-bot@1.0.0-dev.18) (2024-08-03)


### Bug Fixes

* **bots/discord:** set the `label` property correctly for message scans ([6d463df](https://github.com/revanced/revanced-helper/commit/6d463df586dee5dd8fe8d6cff1c5316f7809b32a))

# @revanced/discord-bot [1.0.0-dev.17](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.16...@revanced/discord-bot@1.0.0-dev.17) (2024-08-02)


### Bug Fixes

* **bots/discord/commands/eval:** evaluate in current context ([5925d90](https://github.com/revanced/revanced-helper/commit/5925d902095acef5f6396ca03583a9cbb0862498))
* **bots/discord:** send right response for after regexes ([a7688fa](https://github.com/revanced/revanced-helper/commit/a7688fa9b91919a87f74071b502cd0a87cd1c1fa))


### Features

* **bots/discord:** update example config file ([bc9951c](https://github.com/revanced/revanced-helper/commit/bc9951c9b5e007c3e1b3076aa0966ccf29bb18bc))

# @revanced/discord-bot [1.0.0-dev.16](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.15...@revanced/discord-bot@1.0.0-dev.16) (2024-08-02)


### Bug Fixes

* **bots/discord:** open database as read-write ([c366840](https://github.com/revanced/revanced-helper/commit/c36684091dddf67880505dc459e4334a8a5492f4))
* **bots/discord:** remove bad text channel checks ([f5939e2](https://github.com/revanced/revanced-helper/commit/f5939e25288fea2022fdeec9085ecb9ffada6111))
* **bots/discord:** remove redundant footer for response embeds ([412e003](https://github.com/revanced/revanced-helper/commit/412e00317d1eaca23e9c1375e16f94a5f2fa8d86))


### Features

* **bots/discord/commands:** add `reload` command ([6875b32](https://github.com/revanced/revanced-helper/commit/6875b32fd0c6ce3034da9dc6c704d425afb26f2e))

# @revanced/discord-bot [1.0.0-dev.15](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.14...@revanced/discord-bot@1.0.0-dev.15) (2024-07-31)


### Bug Fixes

* **bots/discord:** import `config` from context ([763ef25](https://github.com/revanced/revanced-helper/commit/763ef253f9d4ff70a8b79969a7f4f41cba7f3c59))


### Features

* **bots/discord:** add sticky messages ([bf66155](https://github.com/revanced/revanced-helper/commit/bf661556e131bf0ef24e47f658fbcd701960e312))

# @revanced/discord-bot [1.0.0-dev.14](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.13...@revanced/discord-bot@1.0.0-dev.14) (2024-07-31)


### Bug Fixes

* **bots/discord:** always true check causing no messages to be scanned ([98ec37b](https://github.com/revanced/revanced-helper/commit/98ec37b5d18cade85270ab83b0ed0abe41244dd9))
* other small issues ([bc437a5](https://github.com/revanced/revanced-helper/commit/bc437a5ec7ce1d339094d608e2a61ac5f460c163))


### Features

* **bots/discord:** add more options for curing, fix default regex ([1a4ec1e](https://github.com/revanced/revanced-helper/commit/1a4ec1ece80becd9156582cc490f6681cb2a1f39))
* **bots/discord:** allow admins to bypass permission checks ([620f933](https://github.com/revanced/revanced-helper/commit/620f9339f0737b79d72c66d90ffa42ea3f987710))

# @revanced/discord-bot [1.0.0-dev.13](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.12...@revanced/discord-bot@1.0.0-dev.13) (2024-07-30)


### Bug Fixes

* **bots/discord:** broken regex when prefix set to special characters ([ab62e55](https://github.com/revanced/revanced-helper/commit/ab62e55e76005f5999d7413d1158e54053f28d1f))

# @revanced/discord-bot [1.0.0-dev.12](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.11...@revanced/discord-bot@1.0.0-dev.12) (2024-07-30)


### Bug Fixes

* **bots/discord:** deployment runtime errors due to minification ([a60c60c](https://github.com/revanced/revanced-helper/commit/a60c60c0f994a4c256b7d0582e99a1731209cf49))

# @revanced/discord-bot [1.0.0-dev.11](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.10...@revanced/discord-bot@1.0.0-dev.11) (2024-07-30)


### Bug Fixes

* **bots/discord:** reset counter when reconnected to api, redo message scan filter logic ([d234d79](https://github.com/revanced/revanced-helper/commit/d234d79310caed9c43e14a905f9ef46a110e071d))

# @revanced/discord-bot [1.0.0-dev.10](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.9...@revanced/discord-bot@1.0.0-dev.10) (2024-07-30)


### Bug Fixes

* **bots/discord:** hanging process when disconnecting from API too many times ([d31616e](https://github.com/revanced/revanced-helper/commit/d31616ebcba6f1dcd8bde183bcb8d1adb1501b61))

# @revanced/discord-bot [1.0.0-dev.9](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.8...@revanced/discord-bot@1.0.0-dev.9) (2024-07-30)


### Features

* **bots/discord:** framework changes and new features ([646ec8d](https://github.com/revanced/revanced-helper/commit/646ec8da87617e6c8f48a89e8054e2cba91da549))

# @revanced/discord-bot [1.0.0-dev.8](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.7...@revanced/discord-bot@1.0.0-dev.8) (2024-07-28)


### Bug Fixes

* **bots/discord:** cross-device link build errors ([38c0699](https://github.com/revanced/revanced-helper/commit/38c06997b4d0f7bb3f1e62618a5e3f088c522e30))


### Features

* **bots/discord:** blacklist and whitelist for filters ([cdb6001](https://github.com/revanced/revanced-helper/commit/cdb600195520dba33110c40841629259e317055e))

# @revanced/discord-bot [1.0.0-dev.7](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.6...@revanced/discord-bot@1.0.0-dev.7) (2024-07-25)


### Bug Fixes

* **bot/discord:** start remove preset timeout for `role-preset` command ([cbf9116](https://github.com/revanced/revanced-helper/commit/cbf91162e27dd4c1ecb976927ab708f1d882abca))
* **bots/discord:** only check for member permissions when specified while correcting responses ([b79a1c7](https://github.com/revanced/revanced-helper/commit/b79a1c7575e94c3e62654c87775cac497be4a50a))
* **bots/discord:** set timeout for eligible mutes to unmute faster ([1f5c5a9](https://github.com/revanced/revanced-helper/commit/1f5c5a92a639973b83a1204355538936e69a4454))


### Features

* **bots/discord:** add `replyToReplied` option in response config ([27662ed](https://github.com/revanced/revanced-helper/commit/27662ed91a79bfac7d3f091834e859a7b57366ce))

# @revanced/discord-bot [1.0.0-dev.6](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.5...@revanced/discord-bot@1.0.0-dev.6) (2024-07-23)


### Bug Fixes

* **bots/discord:** ci issues causing database to not be auto generated ([673aa18](https://github.com/revanced/revanced-helper/commit/673aa189bef1009a3e32ba3b1291a5ee84f2def3))

# @revanced/discord-bot [1.0.0-dev.5](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.4...@revanced/discord-bot@1.0.0-dev.5) (2024-07-23)

# @revanced/discord-bot [1.0.0-dev.4](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.3...@revanced/discord-bot@1.0.0-dev.4) (2024-07-23)


### Bug Fixes

* **bots/discord:** wrong database schema path ([875bd20](https://github.com/revanced/revanced-helper/commit/875bd209b252566414bf89349839cabc01697e1c))

# @revanced/discord-bot [1.0.0-dev.3](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.2...@revanced/discord-bot@1.0.0-dev.3) (2024-07-23)


### Bug Fixes

* **bots/discord:** revert dist denesting, fixes config not found ([0d4898d](https://github.com/revanced/revanced-helper/commit/0d4898dae8b26f8466d3f6b8f62875866f581644))

# @revanced/discord-bot [1.0.0-dev.2](https://github.com/revanced/revanced-helper/compare/@revanced/discord-bot@1.0.0-dev.1...@revanced/discord-bot@1.0.0-dev.2) (2024-07-23)


### Features

* **bots/discord:** don't nest builds in src directory, autogen db when missing ([4834685](https://github.com/revanced/revanced-helper/commit/48346851864c4d4b6276388644dd24ce16222b3e))

# @revanced/discord-bot 1.0.0-dev.1 (2024-07-22)


### Bug Fixes

* **bots/discord/commands/mute:** use existing `parseDuration` util function' ([3e07429](https://github.com/revanced/revanced-helper/commit/3e07429664f7dbb6ce653083e0adb1a232737fde))
* **bots/discord/commands/unmute:** fix option description and embeds ([7fdf8c0](https://github.com/revanced/revanced-helper/commit/7fdf8c0dc722e21fe5a3ad6ef8d3a306ef85f532))
* **bots/discord/commands:** minor issues ([3b2596e](https://github.com/revanced/revanced-helper/commit/3b2596e748cf2cde1500ef2ded55f0faabc2c272))
* **bots/discord/commands:** refactor and add checks ([a2bf3ea](https://github.com/revanced/revanced-helper/commit/a2bf3eade99b46f9ffb55d45b8caf1bcf3d22a9b))
* **bots/discord/database:** fix schema for role presets ([4aa138a](https://github.com/revanced/revanced-helper/commit/4aa138a9af8db7093ef637470fcfdea1f5341236))
* **bots/discord/scripts:** unintentional escaping on windows ([09dc706](https://github.com/revanced/revanced-helper/commit/09dc70632da0597fdb26677acee3f6fccbb2b9b5))
* **bots/discord/utils/discord/embeds:** set thumbnail on moderation embeds ([b056291](https://github.com/revanced/revanced-helper/commit/b056291ad0f2e2eac5eec8aa71f15dbc769aa0f9))
* **bots/discord/utils/discord/rolePresets:** correct property access for presets ([4c6ad11](https://github.com/revanced/revanced-helper/commit/4c6ad11be30c1d6af97c4ae40fc62d05fa7bdd57))
* **bots/discord/utils/discord:** add `moderation` module related functions ([7e8270f](https://github.com/revanced/revanced-helper/commit/7e8270f7d260322e1950e058b221ab088bd595d0))
* **bots/discord/utils/duration:** fix empty string returning with duration is 0 ([83c314e](https://github.com/revanced/revanced-helper/commit/83c314ef5f721abc355272db0e4c182dcfe5d943))
* **bots/discord:** apply active role presets if members rejoin ([f50b26b](https://github.com/revanced/revanced-helper/commit/f50b26b82d66c88fd1dbb8c07d77c177c0e781df))
* **bots/discord:** check token before connecting to bot api ([f3e4408](https://github.com/revanced/revanced-helper/commit/f3e4408aa28fb6a9d21365af8c1bea3d07b481de))
* **bots/discord:** clear role presets after they expire ([faa81f4](https://github.com/revanced/revanced-helper/commit/faa81f4d887eaeae809651f5b68187d033a260f2))
* **bots/discord:** connect to discord API even if initial bot API connection fails ([6658b58](https://github.com/revanced/revanced-helper/commit/6658b582dbeba7e072a7a04c4efa255e7f634aef))
* **bots/discord:** do decancer after resetting nickname ([0303fe3](https://github.com/revanced/revanced-helper/commit/0303fe3e367c07e92f831365d5548ca5b03435b2))
* **bots/discord:** follow-up if reply is already sent when error ([f75060b](https://github.com/revanced/revanced-helper/commit/f75060bc9cda44902cf872def73c116a6df039d7))
* **bots/discord:** messed up file name for `unmute` command ([399dca7](https://github.com/revanced/revanced-helper/commit/399dca71538fe5c8831977694a97058254a17578))
* **bots/discord:** owners cannot bypass checks on some commands ([39cba97](https://github.com/revanced/revanced-helper/commit/39cba973418027ba6ed67e1ae5ab5c6458807562))
* **bots/discord:** remove auto-generated files ([fb8af00](https://github.com/revanced/revanced-helper/commit/fb8af008661bf37389e01cba19d64a8b4fc82139))
* **bots/discord:** remove usage of macros ([7f27c56](https://github.com/revanced/revanced-helper/commit/7f27c5607ceeeef56d67097e88f68caa1b8791b3))
* **bots/discord:** remove useless feature ([d830e48](https://github.com/revanced/revanced-helper/commit/d830e48bc2de7aa457eab3a5f96ae652a93178f9))
* **bots/discord:** use `APIEmbed` for response config ([35b9448](https://github.com/revanced/revanced-helper/commit/35b944800a3943c187d5b0e0d3e465ad7d2056fe))
* **bots/discord:** use env for initializing database ([af3759c](https://github.com/revanced/revanced-helper/commit/af3759caf428fada3b3f4a51852543d6fb280018))
* **bots/discord:** wrong command file path being imported ([fa0159c](https://github.com/revanced/revanced-helper/commit/fa0159c3a8dd4dad8778ccdb75b9e7c02ebbb64f))
* config file not being read ([474a8be](https://github.com/revanced/revanced-helper/commit/474a8be4af4eb2bae6e80a893439d846ad4f7503))
* **discord-bot:** also execute slash commands ([f0d45b2](https://github.com/revanced/revanced-helper/commit/f0d45b2c926ed753e2d21f2e06e24d7e6c43880a))
* **discord-bot:** check for role position ([d332043](https://github.com/revanced/revanced-helper/commit/d332043b1a4bb7ac9698a2fc912832e184130b4b))
* **discord-bot:** check if the member has the role ([9bff68c](https://github.com/revanced/revanced-helper/commit/9bff68c8c40c692764e4dec15a058e35059efbc9))
* **discord-bot:** not executing slash commands ([aa08087](https://github.com/revanced/revanced-helper/commit/aa0808768b90844c5fbd3e75d9f2d01c723b0151))
* **discord-bot:** only send lowercased text ([7803758](https://github.com/revanced/revanced-helper/commit/78037580dc92883f5ca21157e45268850cb5db90))
* dislike button not working properly ([85eba55](https://github.com/revanced/revanced-helper/commit/85eba554247738066af72a8efd0de215ec1164dc))
* fix deprecation ([4373ede](https://github.com/revanced/revanced-helper/commit/4373ede855333f209676551162a525238656e1f8))
* fix the fiter for the interaction collector ([a9ff003](https://github.com/revanced/revanced-helper/commit/a9ff00394a73f68a6793c2b35ff184675ee5a72c))
* ignore message if there's no content ([3cbebc2](https://github.com/revanced/revanced-helper/commit/3cbebc284277808495e64cf0fb47c555924ad9c5))
* move modules to `/bots` ([cd7156e](https://github.com/revanced/revanced-helper/commit/cd7156e792e65777ad1ab5a6f5d828b9ef6a9754))
* trainAI not using the bin location ([bd29943](https://github.com/revanced/revanced-helper/commit/bd2994388bc65f720120ef49edb6ba8163260309))


### chore

* fix more build issues ([77fefb9](https://github.com/revanced/revanced-helper/commit/77fefb9bef286a22f40a4d76b79c64fcc5a2467f))


### Features

* add wit.ai support ([1909e2c](https://github.com/revanced/revanced-helper/commit/1909e2c42148d635dcd045c738d88f65c8be16e3))
* **bots/discord/commands/reply:** send stacktrace when failed ([9f1ac37](https://github.com/revanced/revanced-helper/commit/9f1ac379276c11da65235577a9c6717e01cb02eb))
* **bots/discord/commands:** add `ban` and `unban` commands ([dc4863d](https://github.com/revanced/revanced-helper/commit/dc4863dc208b3fede4d4def323306ab58daffe04))
* **bots/discord/commands:** add `eval` command ([e64d1da](https://github.com/revanced/revanced-helper/commit/e64d1da00cc2ba718da5a4b0da141fe86a0e48d2))
* **bots/discord/commands:** add `mute` and `unmute` commands ([c0fa2fe](https://github.com/revanced/revanced-helper/commit/c0fa2fe1c36acdc7c52cde277aa7da867065f55e))
* **bots/discord/commands:** add `purge` and `role-preset` commands ([fb01ce5](https://github.com/revanced/revanced-helper/commit/fb01ce57400130c93751a11573eb444c0ba103eb))
* **bots/discord/commands:** allow process exception in `exception-test` ([ca47535](https://github.com/revanced/revanced-helper/commit/ca475356ad95fec86e8e8b5bf4bbf17b70add5fe))
* **bots/discord/utils/discord/embeds:** expose `applyCommonEmbedStyles` fn ([2d794ed](https://github.com/revanced/revanced-helper/commit/2d794ede7d7a208bd3616c45e8e6d2a2cd83e9ed))
* **bots/discord/utils/embeds:** make title parameter nullable ([ee885ca](https://github.com/revanced/revanced-helper/commit/ee885ca7585a55fdc31e137ae29dc13a37ce2fb2))
* **bots/discord/utils/fs:** use `recursive` option for listing files ([da21e1a](https://github.com/revanced/revanced-helper/commit/da21e1a6f76deaeb477203b04263bd170863825b))
* **bots/discord/utils:** add duration utility ([a9add9e](https://github.com/revanced/revanced-helper/commit/a9add9ea9affb42bdfcb17cf4b268feec5729854))
* **bots/discord/utils:** add functions for role presets ([fb32a04](https://github.com/revanced/revanced-helper/commit/fb32a04ad38be8d0836dc99259b6ef05a0825830))
* **bots/discord/utils:** allow loading commands from custom dir ([8b690b8](https://github.com/revanced/revanced-helper/commit/8b690b879bb5c6023c8fc863afbd9fd1d02719bb))
* **bots/discord:** add `api.disconnectRetryInterval` config ([2f86586](https://github.com/revanced/revanced-helper/commit/2f8658617923c07f6847cbf1fdfc5f5379d95b6c))
* **bots/discord:** add `moderation.roles` config to be used in `moderation` commands ([39d5b3a](https://github.com/revanced/revanced-helper/commit/39d5b3a479b4d856aabe12cc31177c24f88ae23e))
* **bots/discord:** add `ocrTriggers` resp config, embed footer scan mode ([744a56a](https://github.com/revanced/revanced-helper/commit/744a56a4fdc8844e37959a88bcf81ee39fe726ef))
* **bots/discord:** add a better way to manage databases ([a68d726](https://github.com/revanced/revanced-helper/commit/a68d72687584332587455962b0202a306288057d))
* **bots/discord:** add more fallbacks for decancering ([2e1e009](https://github.com/revanced/revanced-helper/commit/2e1e009b4272495798313bd3bd61f258875c62e1))
* **bots/discord:** add source ([f9d50a0](https://github.com/revanced/revanced-helper/commit/f9d50a0a6bef8beaa428a0a555bfa4f879f685f1))
* **bots/discord:** improve logs ([6abb740](https://github.com/revanced/revanced-helper/commit/6abb7409945c10bd3af451fb45ef4b4d4ebe9489))
* **bots/discord:** sanitize `BasicDatabase` inputs ([fd76e0a](https://github.com/revanced/revanced-helper/commit/fd76e0af72fe28b414ae3b5e8d3886e58561e57e))
* **bots/discord:** support nickname decancering ([1723e8c](https://github.com/revanced/revanced-helper/commit/1723e8cacf96e8c6bdee22cfd30e89524fdcef74))
* **bots/discord:** switch to `drizzle-orm` ([e204b7b](https://github.com/revanced/revanced-helper/commit/e204b7b7566fd7fa423baef32977a8575d44a9e0))
* **bots/discord:** update config ([197d2ac](https://github.com/revanced/revanced-helper/commit/197d2acea89c38e43858d52736508d449152e804))
* discord bot scanning messages ([d1bd3b2](https://github.com/revanced/revanced-helper/commit/d1bd3b2b7e4985a64e9b070ab006cc6f3508c46e))
* **discord-bot:** a way to train AI ([355a508](https://github.com/revanced/revanced-helper/commit/355a50803adc85b5579155b55ddbba4fa0449237))
* **discord-bot:** command handler and train cmd ([6aee8a4](https://github.com/revanced/revanced-helper/commit/6aee8a4c63eb108800fcb0a23ca61f200d8f1f2a))
* **discord-bot:** event handler ([0ad5ece](https://github.com/revanced/revanced-helper/commit/0ad5ece08593c0db111fa4a592b42c6e0348fd1c))
* GODEL AI ([0ba525c](https://github.com/revanced/revanced-helper/commit/0ba525c4a5802106d582c75f713728accf2f151a))
* initalize discord bot ([bb4a5a7](https://github.com/revanced/revanced-helper/commit/bb4a5a77eefbc7ac88536f73a111df1050b235e7))
* initialize helper client ([7f9ca77](https://github.com/revanced/revanced-helper/commit/7f9ca77e0331ec143160ee51ed7c3aa9e4e70b9c))
* message buttons for training ([6551ca9](https://github.com/revanced/revanced-helper/commit/6551ca9dadc2e3ddfe98875e80ed61f7d71a1651))
* platform specific responses ([18e57b0](https://github.com/revanced/revanced-helper/commit/18e57b0c320732a937bb60db11c5d6794ed11522))
* prettier and eslint ([1c27ccb](https://github.com/revanced/revanced-helper/commit/1c27ccb17c85f0f6982db45de426181d2c231d0e))
* refactor and new features ([#7](https://github.com/revanced/revanced-helper/issues/7)) ([8b9f45d](https://github.com/revanced/revanced-helper/commit/8b9f45dc22de29dc2ccb1cfab9a026db00457e25))
* run bots in one process ([d26d533](https://github.com/revanced/revanced-helper/commit/d26d53317440c64fb775cea609a87d29be6c8b40))
* training and replies changed ([715aa91](https://github.com/revanced/revanced-helper/commit/715aa918cf84213c9b19591a398d7532eb3f232a))
* **utils/discord/embeds:** allow adding extra fields for moderation embeds ([49ce9a7](https://github.com/revanced/revanced-helper/commit/49ce9a7ca3d8558b73a9b94dfe7a01d809db6fff))


### BREAKING CHANGES

* In `@revanced/discord-bot`, its environment variable
                 `DATABASE_URL` has been renamed to `DATABASE_PATH`
                 and the `file:` prefix is no longer needed
