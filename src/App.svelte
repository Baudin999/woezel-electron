<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes, navigateTo } from "./Services/navigation";
  import NavButton from "./Controls/NavButton.svelte";
  import NavigationPane from "./Controls/NavigationPane.svelte";
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
    /* min-width: 500px; */
    overflow: auto;
  }
  .left > * {
    box-sizing: border-box;
  }
  .right {
    flex: 1;
    height: 100%;
    overflow: hidden;
    padding: 1em;
  }

  .buttons {
    background: var(--color);
  }
</style>

<!-- 
<div class="buttons">
      <div on:click={() => navigateTo('/home')}>Home</div>
      <div on:click={() => navigateTo('/projects')}>Projects</div>
      <div on:click={() => navigateTo('/lang-tester')}>Language Tester</div>
      <div on:click={() => navigateTo('/page-viewer')}>Page Viewer</div>
      <div on:click={() => navigateTo('/something')}>Not Found</div>
    </div> -->

<div class="container">
  <div class="left">
    <NavigationPane>
      <NavButton title="Home" href="/home" icon="fa fa-home" />
    </NavigationPane>

  </div>
  <div class="right">
    <Router {routes} />
  </div>
</div>
