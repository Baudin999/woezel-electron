<script type="ts">
  export let flex: number = 1;
</script>

<style type="less">
</style>

<div class="panel" style={`flex:${flex};`}>
  <slot />
</div>
