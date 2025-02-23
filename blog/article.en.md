# How I Added Russian and Asian Languages Support to a Popular Logseq Plugin

#logseq #plugin #opensource #productivity #notes #i18n #russian #chinese #japanese #korean

## Hello, community!

I want to share a story about how I extended the capabilities of the popular [Logseq Automatic Linker](https://github.com/sawhney17/logseq-automatic-linker) plugin by adding support for Russian and Asian languages. If you're using Logseq and taking notes in different languages - this post is for you!

## Background

It all started when I was actively using Logseq for taking notes in Russian. The Automatic Linker plugin worked great with English, but there were issues with Russian text:
- Links weren't created for Russian words
- Case sensitivity confusion
- Problems with spaces in titles

I noticed that users from China, Japan, and Korea were facing similar issues. So I decided to fix it!

## What's Been Done

1. Added support for the following languages:
   - Russian 🇷🇺
   - Chinese 🇨🇳
   - Japanese 🇯🇵
   - Korean 🇰🇷
   - German 🇩🇪

2. Improved handling of:
   - Unicode characters
   - Mixed language content
   - Special characters
   - Spaces in different languages

## How It Works

Here's a simple example. Let's say you have this text:
```
This is a note about Logseq and 笔记 with some テスト
```

The plugin will automatically transform it into:
```
This is a note about [[Logseq]] and [[笔记]] with some [[テスト]]
```

Everything works out of the box - no additional setup or configuration needed.

## Technical Details (for the curious)

The main challenge was handling Unicode correctly. Here's the key code snippet:

```typescript
const parseForRegex = (s: string) => {
  s = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Support for spaces in all languages
  s = s.replace(/\s+/g, "[\\s\\u0020\\u00A0]+");
  return s;
};
```

## How to Use

1. Install the plugin from Logseq Marketplace
2. Use <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> for automatic mode
3. Write in any supported language!

## Results

After adding support for new languages:
- The plugin became accessible to a wider audience
- Improved quality of multilingual note-taking
- Gained community support from different countries

## Future Plans

- Add support for more languages (Arabic, Hebrew)
- Improve mixed text handling
- Add per-language settings

## Want to Help?

The project is open for contributors! If you want to add support for your language:
1. Fork the [repository](https://github.com/the-homeless-god/logseq-automatic-linker-international)
2. Add tests for your language
3. Create a Pull Request

## Useful Links

- [Original plugin](https://github.com/sawhney17/logseq-automatic-linker)
- [My fork with language support](https://github.com/the-homeless-god/logseq-automatic-linker-international)
- [Logseq Marketplace](https://github.com/logseq/marketplace)

## From the Author

If you have any questions or suggestions - create issues in the repository or contact me directly. Let's make working with Logseq more convenient for everyone, regardless of language! 
