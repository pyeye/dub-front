<template>
  <div class="badge" :class="{'dot': type === 'dot'}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SalesBadge',
  props: {
    type: {
      type: String,
      default: 'text',
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.badge {
  display: inline-block;
  color: #fafafa;
  font-size: 12px;
  padding: 2px 4px;
  text-align: center;
  background-color: #e83841;
  letter-spacing: 0.012em;
  font-weight: 600;
  box-sizing: border-box;
  line-height: 14px;
}
.dot {
  border-radius: 50%;
  min-width: 6px;
  min-height: 6px;
  padding: 0;
}
</style>
