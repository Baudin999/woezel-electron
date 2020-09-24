<script lang="ts">
  import { onDestroy, setContext } from "svelte";
  // import { location } from "svelte-spa-router";

  // setContext("location", null);
  // let unsubscribe = location.subscribe((l) => {
  //   debugger;
  //   setContext("location", l);
  // });
  // onDestroy(() => {
  //   console.log("destroying...");
  //   unsubscribe();
  // });
</script>

<style lang="less">
  .navigation-pane {
    background: var(--color-secundary);
    color: var(--color-secundary--alt);
    height: 100%;
    overflow: hidden;
    text-align: center;
  }
</style>

<div class="navigation-pane">
  <slot />
</div>
