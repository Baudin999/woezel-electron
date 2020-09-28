<script type="ts">
  import { writable } from "svelte/store";
  import { Tabs, Tab, TabList, TabPanel } from "./../Controls/Tabs/index";
  import { Expression, SyntaxKind, CompilerContext } from "./../Compiler/types";
  import Editor from "./../Controls/Editor.svelte";
  import StackPanel from "./../Controls/StackPanel.svelte";
  import Panel from "./../Controls/Panel.svelte";
  import type { IError } from "../Compiler/errorSink";
  import { compile } from "../Compiler/compiler";
  import { debounce } from "../Services/debounce";

  let txt = "";
  let tokensJson = "";
  let jsText = "";
  let astJson = "";
  let messages = [];
  let compilationErrors = [];
  let markers = writable([]);

  let textChanged = debounce((event) => {
    console.clear();
    messages = [];
    const text = event.detail;
    try {
      const { javascript, tokens, ast, errors } = compile(text, {
        format: false,
        context: CompilerContext.Node,
      });
      const displayTokens = tokens.map((t) => {
        return { ...t, kind: SyntaxKind[t.kind] };
      });
      tokensJson = JSON.stringify(displayTokens, null, 4);
      astJson = JSON.stringify(
        ast.map((n) => new Expression(n)),
        null,
        4
      );
      jsText = javascript;
      var result = Function(javascript)();
      messages = [...messages, result];
      compilationErrors = errors;
      markers.set(errors.map(mapErrorToken));

      // store the parsed data only when everything went well..
      localStorage.setItem("code", text);
    } catch (error) {
      console.log("Error on compile");
      console.error(error);
    } finally {
      //
    }
  });

  let mapErrorToken = (e: IError) => {
    if (!e || !e.position) return;
    return {
      startLineNumber: e.position.startLine + 1,
      endLineNumber: e.position.endLine + 1,
      startColumn: e.position.startColumn + 1,
      endColumn: e.position.endColumn + 1,
      message: e.message,
    };
  };

  (() => {
    try {
      setTimeout(() => {
        txt = localStorage.getItem("code");
        textChanged({ detail: txt });
      });
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
      overflow: hidden;
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid lightgrey;
      white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
      white-space: -pre-wrap; /* Opera 4-6 */
      white-space: -o-pre-wrap; /* Opera 7 */
      white-space: pre-wrap; /* css-3 */
      word-wrap: break-word; /* Internet Explorer 5.5+ */
      white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
      word-break: break-all;
      white-space: normal;
      pre {
        margin: 0;
      }
    }
  }
</style>

<div class="container">
  <div class="left">
    <Tabs>
      <TabList>
        <Tab>index.car</Tab>
      </TabList>
      <TabPanel>
        <StackPanel>
          <Panel flex={3}>
            <Editor on:change={textChanged} text={txt} {markers} />
          </Panel>
          <Panel flex={1}>
            <div style="border-top: 1px solid grey;">
              <ul class="messages">
                {#each compilationErrors as error}
                  <li>
                    <pre>{error.message}</pre>
                  </li>
                {/each}
              </ul>
            </div>
          </Panel>
        </StackPanel>
      </TabPanel>
    </Tabs>
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
          <Panel flex={3}>
            <Editor language="javascript" text={jsText} />
          </Panel>
          <Panel flex={1}>
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
