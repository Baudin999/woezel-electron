<script>
  import { createEventDispatcher } from "svelte";
  export let checked = false;

  var dispatcher = createEventDispatcher();
</script>

<style>
  .toggle {
    /* margin-bottom: 1em; */
    font-size: 1rem;
  }

  .toggle + .toggle {
    margin-top: 1.25em;
    padding-top: 1em;
    border-top: 1px solid #ddd;
  }

  .toggle {
    position: relative;
  }

  .toggle-input {
    border: 0;
    clip: rect(0 0 0 0);
    height: auto;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  .toggle-label {
    cursor: pointer;
    position: relative;
  }

  .toggle-label,
  .toggle-track,
  .toggle-switch {
    display: inline-block;
    vertical-align: middle;
  }

  .toggle-title + .toggle-track {
    margin-left: 0.375em;
  }

  .toggle-track {
    position: relative;
    top: -0.125em;
    width: 3em;
    height: 1em;
    background-color: #eee;
    border: 0.0625em solid rgba(0, 0, 0, 0.15);
    border-radius: 24em;
    transition: 0.35s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: background-color, border-color;
  }

  .toggle-label .toggle-input:checked ~ .toggle-track {
    background-color: #bbe572;
    border-color: rgba(0, 0, 0, 0.05);
  }

  .toggle-switch {
    position: absolute;
    top: 0;
    right: 24px;
    bottom: 0;
    left: 0;
    background-color: white;
    border-radius: 24em;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),
      inset 1px 1px 3px rgba(255, 255, 255, 0.8);
    transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0s, 0.05s;
  }

  .toggle-label:active .toggle-switch {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),
      inset 1px 1px 3px rgba(255, 255, 255, 0.8),
      inset 1px 1px 6px rgba(0, 0, 0, 0.1);
  }

  .toggle-label .toggle-input:checked ~ .toggle-track > .toggle-switch {
    right: 0;
    left: 24px;
    transition: 0.35s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0.05s, 0s;
  }
</style>

<div class="toggle">
  <div class="controls">
    <div class="toggle">
      <label class="toggle-label">
        <input class="toggle-input" type="checkbox" bind:checked on:change />
        <span class="toggle-track">
          <span class="toggle-switch" />
        </span>
      </label>
    </div>
  </div>
</div>
