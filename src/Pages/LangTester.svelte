<script>
  //
  import Editor from "./../Controls/Editor.svelte";
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
    min-width: 200px;
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
    <Editor text="let foo = 2" />
  </div>
  <div class="right">
    <Editor
      language="json"
      text={`
{
    "something": "other",
    "number": 2
}
`} />
  </div>
</div>
