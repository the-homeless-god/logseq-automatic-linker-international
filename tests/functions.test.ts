import { replaceContentWithPageLinks } from "../src/functions";
import { describe, expect, it } from '@jest/globals';

describe("replaceContentWithPageLinks()", () => {
  it("should preserve code blocks", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page"],
      "page before ```\npage within code block\n```\npage between\n```\nanother page within code block```\nand finally\n```\nwith `single` backticks and page within\n```\npage after",
      false,
      false
    );
    expect(content).toBe(
      "[[page]] before ```\npage within code block\n```\n[[page]] between\n```\nanother page within code block```\nand finally\n```\nwith `single` backticks and page within\n```\n[[page]] after"
    );
    expect(update).toBe(true);
  });

  it("should preserve inline code", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page"],
      "Page before\n`page inside inline code`\npage between\n`another page inline`\n`but not page if inline\nblock is split between newlines`\npage after",
      false,
      false
    );
    expect(content).toBe(
      "[[Page]] before\n`page inside inline code`\n[[page]] between\n`another page inline`\n`but not page if inline\nblock is split between newlines`\n[[page]] after"
    );
    expect(update).toBe(true);
  });

  it("should preserve properties", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page", "price"],
      `Some page here with price
        price:: 123
        page:: this is a property`,
      false,
      false
    );
    expect(content).toBe(
      `Some [[page]] here with [[price]]
        price:: 123
        page:: this is a property`
    );
    expect(update).toBe(true);
  });

  it("should preserve Markdown links", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page", "link", "Logseq"],
      `This page has a link: [page link will not be touched](http://a.com)
      [another page](http://b.com) also with a link
      [\\[This\\] is a Logseq page](https://logseq.com)`,
      false,
      false
    );
    expect(content).toBe(
      `This [[page]] has a [[link]]: [page link will not be touched](http://a.com)
      [another page](http://b.com) also with a [[link]]
      [\\[This\\] is a Logseq page](https://logseq.com)`
    );
    expect(update).toBe(true);
  });

  it("should preserve custom query scripts", () => {
    const customQueries = [
      `#+BEGIN_QUERY
    {
      :title [:h2 "In Progress"]
      :query [
        :find (pull ?b [*])
        :where
          [?b :block/uuid]
          [?b :block/marker ?marker]
           [(contains? #{"NOW", "DOING", "IN PROGRESS", "IN-PROGRESS"} ?marker)]
      ]
      :result-transform (
        fn [result] ( sort-by ( 
          fn [item] ( get item :block/priority "Z" )
        )
        result)
      )
      :remove-block-children? false
      :group-by-page? false
      :breadcrumb-show? false
      :collapsed? false
    }
    #+END_QUERY`,
      `#+BEGIN_QUERY
    {
      :title [:h2 "TO DO"]
      :query [
        :find (pull ?b [*])
        :where
          [?b :block/uuid]
          [?b :block/marker ?marker]
           [(contains? #{"TO DO", "LATER"} ?marker)]
      ]
      :result-transform (
        fn [result] ( sort-by ( 
          fn [item] ( get item :block/priority "Z" )
        )
        result)
      )
      :remove-block-children? false
      :group-by-page? false
      :breadcrumb-show? false
      :collapsed? false
    }
    #+END_QUERY`,
    ];

    const [content, update] = replaceContentWithPageLinks(
      ["In Progress", "find", "link"],
      `${customQueries[0]}
      
      Ths sentence contains a link
      
      ${customQueries[1]}`,
      false,
      false
    );

    expect(content).toEqual(
      `${customQueries[0]}
      
      Ths sentence contains a [[link]]
      
      ${customQueries[1]}`
    );
    expect(update).toBe(true);
  });

  it.each([
    {
      input: "NOW [#A] A started todo",
      expected: "NOW [#A] A started [[todo]]",
    },
    {
      input: "LATER [#B] A todo for later",
      expected: "LATER [#B] A [[todo]] for [[Later]]",
    },
    {
      input: "DOING [#A] Fix the todo marker issue",
      expected: "DOING [#A] Fix the [[todo]] marker issue",
    },
    { input: "DONE A done todo", expected: "DONE A [[Done]] [[todo]]" },
    {
      input: "CANCELED A canceled todo",
      expected: "CANCELED A [[Canceled]] [[todo]]",
    },
    {
      input: "CANCELLED A cancelled todo",
      expected: "CANCELLED A [[Cancelled]] [[todo]]",
    },
    {
      input: "IN-PROGRESS An in progress To Do",
      expected: "IN-PROGRESS An [[In Progress]] [[To Do]]",
    },
    { input: "TODO A todo", expected: "TODO A [[todo]]" },
    {
      input: "WAIT [#C] A todo waiting to be unblocked",
      expected: "WAIT [#C] A [[todo]] [[Waiting]] to be unblocked",
    },
    {
      input: "WAITING A waiting todo",
      expected: "WAITING A [[Waiting]] [[todo]]",
    },
  ])("should preserve the to do marker for $input", ({ input, expected }) => {
    let [content, update] = replaceContentWithPageLinks(
      [
        "Now",
        "Later",
        "Doing",
        "Done",
        "Canceled",
        "Cancelled",
        "In Progress",
        "In-Progress",
        "To Do",
        "todo",
        "Wait",
        "Waiting",
      ],
      input,
      false,
      false
    );
    expect(content).toBe(expected);
    expect(update).toBe(true);
  });

  it("should output tags when parseAsTags is configured", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page", "multiple words"],
      "This page has multiple words",
      true,
      false
    );
    expect(content).toBe("This #page has #[[multiple words]]");
    expect(update).toBe(true);
  });

  it("should output tags when parseSingleWordAsTag is configured", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["one", "multiple words"],
      "This one becomes a tag but multiple words get brackets",
      false,
      true
    );
    expect(content).toBe(
      "This #one becomes a tag but [[multiple words]] get brackets"
    );
    expect(update).toBe(true);
  });

  it("should return the same content if nothing was parsed", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["page"],
      "This text doesn't have any links to be parsed",
      false,
      false
    );
    expect(content).toBe("This text doesn't have any links to be parsed");
    expect(update).toBe(false);
  });

  it("should keep the original input case for lowercase pages", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["when", "for pages", "because", "links", "logseq"],
      `When creating links, the original case that was typed should be preserved
      for PAGES that only have lowercase words.
      Because logSEQ LINKS are case-insensitive anyway.`,
      false,
      false
    );
    expect(content).toBe(
      `[[When]] creating [[links]], the original case that was typed should be preserved
      [[for PAGES]] that only have lowercase words.
      [[Because]] [[logSEQ]] [[LINKS]] are case-insensitive anyway.`
    );
    expect(update).toBe(true);
  });

  it("should disregard the input case and use the page case for uppercase, title case and mixed case pages", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["John Doe", "Mary Doe", "ANYWAY", "Logseq", "But"],
      `When creating links, the page case should be used when it's not lowercase.
      So things like names are properly capitalised even when typed in lowercase: john doe, mary doe.
      logseq LINKS are case-insensitive anyway.
      but LOGSEQ will keep the case of pages that are uppercase or title case when displaying,
      even if you type them in lowercase`,
      false,
      false
    );
    expect(content).toBe(
      `When creating links, the page case should be used when it's not lowercase.
      So things like names are properly capitalised even when typed in lowercase: [[John Doe]], [[Mary Doe]].
      [[Logseq]] LINKS are case-insensitive [[ANYWAY]].
      [[But]] [[Logseq]] will keep the case of pages that are uppercase or title case when displaying,
      even if you type them in lowercase`
    );
    expect(update).toBe(true);
  });

  it("should detect Unicode links", () => {
    let [content, update] = replaceContentWithPageLinks(
      ["가나다"],
      `This block implicitly contains unicode words like 가나다.`,
      false,
      false
    );
    expect(content).toBe(
      `This block implicitly contains unicode words like [[가나다]].`
    );
  });

  describe("Russian language support", () => {
    it("should handle basic Russian words", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Тест", "Страница"],
        "Это Тест и Страница",
        false,
        false
      );
      expect(content).toBe("Это [[Тест]] и [[Страница]]");
      expect(update).toBe(true);
    });

    it("should handle Russian words with spaces", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Новая Страница", "Тестовый Документ"],
        "Это Новая Страница и Тестовый Документ",
        false,
        false
      );
      expect(content).toBe("Это [[Новая Страница]] и [[Тестовый Документ]]");
      expect(update).toBe(true);
    });

    it("should handle mixed Russian-English text", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Test", "Тест", "Page", "Страница"],
        "This is a Test and Page с Тест и Страница",
        false,
        false
      );
      expect(content).toBe("This is a [[Test]] and [[Page]] с [[Тест]] и [[Страница]]");
      expect(update).toBe(true);
    });

    it("should handle Russian case sensitivity", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["тест", "ТЕСТ", "Тест"],
        "Это тест, ТЕСТ и Тест",
        false,
        false
      );
      expect(content).toBe("Это [[тест]], [[ТЕСТ]] и [[Тест]]");
      expect(update).toBe(true);
    });

    it("should handle Russian tags", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["тест", "документация"],
        "Это #тест и документация",
        true,
        true
      );
      expect(content).toBe("Это #тест и #документация");
      expect(update).toBe(true);
    });
  });

  describe("Chinese language support", () => {
    it("should handle basic Chinese words", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["测试", "页面"],
        "这是 测试 和 页面",
        false,
        false
      );
      expect(content).toBe("这是 [[测试]] 和 [[页面]]");
      expect(update).toBe(true);
    });

    it("should handle Chinese words with spaces", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["新的页面", "测试文档"],
        "这是 新的页面 和 测试文档",
        false,
        false
      );
      expect(content).toBe("这是 [[新的页面]] 和 [[测试文档]]");
      expect(update).toBe(true);
    });

    it("should handle Chinese tags", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["测试", "文档"],
        "这是 #测试 和 文档",
        true,
        true
      );
      expect(content).toBe("这是 #测试 和 #文档");
      expect(update).toBe(true);
    });
  });

  describe("Japanese language support", () => {
    it("should handle basic Japanese words", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["テスト", "ページ"],
        "これは テスト と ページ です",
        false,
        false
      );
      expect(content).toBe("これは [[テスト]] と [[ページ]] です");
      expect(update).toBe(true);
    });

    it("should handle Japanese words with spaces", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["新しいページ", "テスト文書"],
        "これは 新しいページ と テスト文書 です",
        false,
        false
      );
      expect(content).toBe("これは [[新しいページ]] と [[テスト文書]] です");
      expect(update).toBe(true);
    });

    it("should handle Japanese tags", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["テスト", "文書"],
        "これは #テスト と 文書",
        true,
        true
      );
      expect(content).toBe("これは #テスト と #文書");
      expect(update).toBe(true);
    });
  });

  describe("Korean language support", () => {
    it("should handle basic Korean words", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["테스트", "페이지"],
        "이것은 테스트 와 페이지 입니다",
        false,
        false
      );
      expect(content).toBe("이것은 [[테스트]] 와 [[페이지]] 입니다");
      expect(update).toBe(true);
    });

    it("should handle Korean words with spaces", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["새로운 페이지", "테스트 문서"],
        "이것은 새로운 페이지 와 테스트 문서 입니다",
        false,
        false
      );
      expect(content).toBe("이것은 [[새로운 페이지]] 와 [[테스트 문서]] 입니다");
      expect(update).toBe(true);
    });

    it("should handle Korean tags", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["테스트", "문서"],
        "이것은 #테스트 와 문서",
        true,
        true
      );
      expect(content).toBe("이것은 #테스트 와 #문서");
      expect(update).toBe(true);
    });
  });

  describe("German language support", () => {
    it("should handle basic German words", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Test", "Seite"],
        "Dies ist ein Test und eine Seite",
        false,
        false
      );
      expect(content).toBe("Dies ist ein [[Test]] und eine [[Seite]]");
      expect(update).toBe(true);
    });

    it("should handle German words with spaces", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Neue Seite", "Test Dokument"],
        "Dies ist eine Neue Seite und ein Test Dokument",
        false,
        false
      );
      expect(content).toBe("Dies ist eine [[Neue Seite]] und ein [[Test Dokument]]");
      expect(update).toBe(true);
    });

    it("should handle German special characters", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Übung", "Straße", "Größe"],
        "Eine Übung auf der Straße mit Größe",
        false,
        false
      );
      expect(content).toBe("Eine [[Übung]] auf der [[Straße]] mit [[Größe]]");
      expect(update).toBe(true);
    });

    it("should handle German tags", () => {
      let [content, update] = replaceContentWithPageLinks(
        ["Test", "Dokument"],
        "Dies ist ein #Test und ein Dokument",
        true,
        true
      );
      expect(content).toBe("Dies ist ein #Test und ein #Dokument");
      expect(update).toBe(true);
    });
  });
});
