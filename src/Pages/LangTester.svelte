<script>
  import { lex } from "./../Compiler/lexer";
  import { SyntaxKind } from "./../Compiler/types";
  import Editor from "./../Controls/Editor.svelte";

  let txt = "";
  let json = "";
  let textChanged = event => {
    var text = event.detail;
    localStorage.setItem("code", text);
    var tokens = lex(text).map(t => {
      return { ...t, kind: SyntaxKind[t.kind] };
    });
    json = JSON.stringify(tokens, null, 4);
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
  }
</style>

<div class="container">
  <div class="left">
    <Editor on:change={textChanged} text={txt} />
  </div>
  <div class="right">
    <Editor language="json" text={json} />
  </div>
</div>
