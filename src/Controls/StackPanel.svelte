<script type="ts">
  import { Orientation } from "./componentTypes";
  export const orientation: Orientation = Orientation.Vertical;
</script>

<style type="less">
  .stackpanel {
    display: flex;
    height: 100%;
    width: 100%;
  }
</style>

<div
  class="stackpanel"
  style={`flex-direction:${orientation ? 'row' : 'column'};`}>
  <slot />
</div>
