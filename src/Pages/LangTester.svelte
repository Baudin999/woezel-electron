<script>
  import { Tabs, Tab, TabList, TabPanel } from "./../Controls/Tabs/index";
  import { lex } from "./../Compiler/lexer";
  import { Expression, SyntaxKind } from "./../Compiler/types";
  import Editor from "./../Controls/Editor.svelte";
  import { parser } from "../Compiler/parser";
  import { transpile } from "../Compiler/Transpiler/js";

  let txt = "";
  let tokensJson = "";
  let javascript = "";
  let astJson = "";
  let errorsJson = "";

  let textChanged = (event) => {
    const text = event.detail;
    localStorage.setItem("code", text);
    const tokens = lex(text);
    const { ast, errors } = parser(tokens);
    javascript = transpile(ast);

    const displayTokens = tokens.map((t) => {
      return { ...t, kind: SyntaxKind[t.kind] };
    });
    tokensJson = JSON.stringify(displayTokens, null, 4);
    astJson = JSON.stringify(
      ast.map((n) => new Expression(n)),
      null,
      4
    );
    errorsJson = JSON.stringify(errors, null, 4);

    // console.log(javascript);
  };

  (() => {
    try {
      txt = localStorage.getItem("code");
      textChanged({ detail: txt });
    } catch (ex) {
      //
    }
  })();
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }
  .left {
    height: 100%;
    border-right: 1px solid lightgray;
    transition: all 1s ease-in-out;
    min-width: 500px;
    overflow: auto;
  }
  .left > * {
    box-sizing: border-box;
  }
  .right {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="container">
  <div class="left">
    <Editor on:change={textChanged} text={txt} />
  </div>
  <div class="right">
    <Tabs>
      <TabList>
        <Tab>Javascript</Tab>
        <Tab>AST</Tab>
        <Tab>Tokens</Tab>
      </TabList>

      <TabPanel>
        <Editor language="javascript" text={javascript} />
      </TabPanel>

      <TabPanel>
        <Editor language="json" text={astJson} />
      </TabPanel>

      <TabPanel>
        <Editor language="json" text={tokensJson} />
      </TabPanel>
    </Tabs>
  </div>
</div>
