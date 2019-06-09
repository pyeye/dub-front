<template>
  <div :class="[type]" class="vs-collapse">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DubCollapse',
  props: {
    accordion: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'default',
      type: String,
    },
    openHover: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    emitChange() {
      this.$emit('change');
    },
    closeAllItems(el) {
      const children = this.$children;
      // eslint-disable-next-line array-callback-return
      children.map(item => {
        if (item.$el !== el) {
          // eslint-disable-next-line no-param-reassign
          item.maxHeight = '0px';
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-collapse {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  // box-shadow: 0px 2px 12px 0px rgba(0,0,0,.05)
  padding: 10px;

  &.shadow {
    .open-item {
      transform: scale(1.01);
      box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
      margin-top: 5px;
      border-bottom: 0px solid rgba(0, 0, 0, 0);
      margin-bottom: 10px;
      border-radius: 6px;

      .con-content-item {
        opacity: 1;
      }

      .vs-collapse-item--icon-header {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }

  &.default {
    .open-item {
      .con-content--item {
        opacity: 1;
      }

      .vs-collapse-item--icon-header {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
}
</style>
