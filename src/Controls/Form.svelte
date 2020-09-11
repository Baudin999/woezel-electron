<script>
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import { get } from "svelte/store";
  import NavButton from "./NavButton.svelte";

  export let submit = () => {};
  export let data;
  export let errors;
  export let tight = false;

  setContext("data", data);
  setContext("errors", errors);
</script>

<style>
  .ckc-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* align-items: center;
    align-items: center; */
    padding: 2rem;
  }
  .tight {
    padding: 0;
    align-items: flex-start;
  }
</style>

<form
  class="ckc-form"
  class:tight
  on:submit|preventDefault={() => submit(get(data))}>
  <slot />

  <div class="form-field">
    <button class="button--primary noselect" onClick={submit}>Submit</button>
  </div>
</form>
