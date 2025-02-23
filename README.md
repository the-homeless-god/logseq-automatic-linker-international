# Automatic Linker for Logseq International

<img width="573" alt="image" src="https://github.com/user-attachments/assets/bc769b8d-fa9c-4f9d-9956-415f6393d8e5" />

## Language Support

The plugin supports automatic linking for multiple languages with their specific characteristics:

### Currently Supported Features:

- Multi-language text recognition
- Special characters handling (е.g., German umlauts: ä, ö, ü, ß)
- Mixed language content (e.g., English + Chinese, Russian + English)
- Case sensitivity for all languages
- Tag support (#) for all languages
- Space-separated words and phrases
- Unicode support for Asian languages

### Adding Support for a New Language

If you want to add support for a new language, follow these steps:

1. Add tests in `tests/functions.test.ts`:
```typescript
describe("Your Language support", () => {
  it("should handle basic words", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["YourWord1", "YourWord2"],
      "Your test sentence with YourWord1 and YourWord2",
      false,
      false
    );
    expect(content).toBe("Your test sentence with [[YourWord1]] and [[YourWord2]]");
    expect(update).toBe(true);
  });

  it("should handle words with spaces", () => {
    // Test for multi-word phrases
  });

  it("should handle special characters", () => {
    // Test for language-specific characters
  });

  it("should handle tags", () => {
    // Test for # tag functionality
  });
});
```

2. If your language requires special handling (like Chinese characters), add appropriate regex patterns in `src/functions.ts`.

3. Update the language list in this README.

4. Run tests (`yarn test`) to ensure everything works correctly.

### Language-Specific Notes

- **Asian Languages (Chinese, Japanese, Korean)**: Uses specific Unicode range detection
- **European Languages**: Supports special characters and diacritics
- **Mixed Language Content**: Automatically handles mixed language content in the same text
- **Case Sensitivity**: Preserves original case when the page name is lowercase, uses page case otherwise

![GitHub all releases](https://img.shields.io/github/downloads/the-homeless-god/logseq-automatic-linker-international/total) ![version](https://img.shields.io/github/package-json/v/the-homeless-god/logseq-automatic-linker-international)

A plugin to automatically create links while typing.

Requires logseq version 0.67 and above to function properly
![Screen Recording 2022-05-11 at 8 03 24 AM](https://user-images.githubusercontent.com/80150109/167770331-a89d9939-888f-466c-9738-29daa263e724.gif)

## Instructions

1. Install the plugin from the marketplace
2. Use the keyboard shortcut <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> to enable automatic mode
3. Else, Use <kbd>Command</kbd>+<kbd>P</kbd> to parse the current block
4. Else, right click the bullet and click parse block for links
5. Watch as the links are automatically made!!

## Customization

- Ignoring specific pages from being auto linked
  1. Add a property. `automatic-ignore:: true`
  2. This page, and all its aliases, will now be ignored from auto linking! (Thanks [@trashhalo](https://github.com/trashhalo))

## Development

1.  Fork the repo.
2.  Install dependencies and build the dev version:

        yarn install && yarn run dev

3.  Open Logseq and navigate to the plugins dashboard: `t` `p`.
4.  Click `Load unpacked plugin button`, then select the repo directory to load it.

After every change you make in the code:

1.  Rebuild the dev version:

        yarn run dev

2.  Open Logseq and navigate to the plugins dashboard: `t` `p`.
3.  Find the plugin and click on "Reload".
4.  Ignore the error messages about keyboard shortcut conflicts.

To run tests:

    yarn test


## Thank you
Thank you to all contributors to the project!
- @jwoo0122
- @adxsoft
- @falense
- @andreoliwa
- @jjaychen1e
- @trashhalo
- @Laptop765
- @robotii
- @mortein
