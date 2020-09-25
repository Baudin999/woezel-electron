<script>
  import { Tabs, Tab, TabList, TabPanel } from "./../Controls/Tabs/index";
  import { lex } from "./../Compiler/lexer";
  import { Expression, SyntaxKind } from "./../Compiler/types";
  import Editor from "./../Controls/Editor.svelte";
  import StackPanel from "./../Controls/StackPanel.svelte";
  import Panel from "./../Controls/Panel.svelte";
  import { parser } from "../Compiler/parser";
  import { transpile } from "../Compiler/Transpiler/js";
  import prettier from "prettier";
  import babel from "@babel/parser";

  let txt = "";
  let tokensJson = "";
  let javascript = "";
  let astJson = "";
  let errorsJson = "";
  let messages = [];

  let textChanged = (event) => {
    const text = event.detail;
    localStorage.setItem("code", text);
    const tokens = lex(text);
    const { ast, errors } = parser(tokens);

    let old = console.log;
    try {
      messages = [];
      javascript = prettier.format(transpile(ast), { parser: babel.parse });
      console.log = function (...args) {
        messages.push(args);
      };
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
      var evalResult = Function(javascript);
      evalResult();
    } catch (error) {
      console.error(error.message);
    } finally {
      console.log = old;
      if (errors && errors.length) console.log(errors);
    }
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

<style type="less">
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
    min-width: 750px;
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
  .messages {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid orange;
    }
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
        <StackPanel>
          <Panel flex="3">
            <Editor language="javascript" text={javascript} />
          </Panel>
          <Panel flex="1">
            <div style="border-top: 1px solid grey;">
              <ul class="messages">
                {#each messages as message}
                  <li>{message}</li>
                {/each}
              </ul>
            </div>
          </Panel>
        </StackPanel>
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
