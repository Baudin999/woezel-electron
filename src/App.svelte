<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes, navigateTo } from "./Services/navigation";
</script>

<style>

</style>

<div class="buttons">
  <div on:click={() => navigateTo('/home')}>Home</div>
  <div on:click={() => navigateTo('/projects')}>Projects</div>
  <div on:click={() => navigateTo('/lang-tester')}>Language Tester</div>
  <div on:click={() => navigateTo('/something')}>Not Found</div>
</div>
<Router {routes} />
