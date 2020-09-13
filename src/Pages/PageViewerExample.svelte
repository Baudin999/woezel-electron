<script>
  import PageViewer from "./../Controls/PageViewer.svelte";
  let content;
</script>

<style>
  :global(*, *:before, *:after) {
    box-sizing: border-box;
  }
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  .editor-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }
  .editor-resizer {
    flex: 1;
    height: 100%;
    width: 100%;
  }
  .editor {
    height: 100%;
    width: 100%;
  }
  .page-container {
    font-family: sans-serif;
    background: gray;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 1cm;
    padding-top: 1cm;
    flex: 2;
  }
</style>

<div class="editor-container">
  <div class="editor-resizer">
    <textarea bind:value={content} class="editor" />
  </div>

  <div class="page-container">
    <PageViewer {content} />
  </div>
</div>
