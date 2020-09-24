<script>
  import { push } from "svelte-spa-router";
  import { locationService } from "./../Services/navigation";

  export let href = undefined;
  export let title = "";
  export let onClick = () => {};
  export let icon = undefined;
  export let restricted = false;
  export let link = false;

  let selected = false;

  locationService.subscribe((loc) => {
    selected = loc === href;
    console.log(loc, href, selected);
  });

  const click = () => {
    if (onClick) onClick();
    if (href && !restricted) push(href);
  };
</script>

<style lang="less">
  .nav-button {
    display: block;
    padding: 1rem;
    user-select: none;
    position: relative;
    &.icon {
      i {
        font-size: 2rem;
      }
    }
    .title {
      display: inline-block;
      margin-top: 1rem;
    }

    &:hover {
      cursor: pointer;
      background: var(--color-primary);
      color: var(--color-primary--alt);
    }

    &.selected {
      background: var(--color-secundary--selected);
      .selected-bar {
        visibility: visible;
      }
    }

    .selected-bar {
      display: inline-block;
      width: 5px;
      background: var(--color-primary);
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      visibility: hidden;
      z-index: 999;
    }
  }

  .link {
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }
</style>

{#if icon}
  <span class="nav-button icon" class:selected class:link on:click={click}>
    <i class={icon} />
    <br />
    {#if title && title.length > 0}<span class="title">{title}</span>{/if}
    <div class="selected-bar" />
  </span>
{:else}
  <span class="nav-button" class:selected class:link on:click={click}>
    {title}
  </span>
{/if}
