<template>
  <div
    :class="{'open-item': maxHeight != '0px', 'disabledx': disabled}"
    class="vs-collapse-item"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
    <header class="vs-collapse-item--header" @click="toggleContent">
      <slot name="header"></slot>

      <span v-if="!notArrow" class="icon-header vs-collapse-item--icon-header">
        <dub-icon width=24 height=24><icon-arrow-down class="icon-link" /></dub-icon>
      </span>
    </header>
    <div ref="content" :style="styleContent" class="vs-collapse-item--content">
      <div class="con-content--item">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DubCollapseItem',
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    notArrow: {
      default: false,
      type: Boolean,
    },
    resizeCollapse: {
      type: Boolean,
    },
  },
  data: () => ({
    maxHeight: '0px',
  }),
  computed: {
    accordion() {
      return this.$parent.accordion;
    },
    openHover() {
      return this.$parent.openHover;
    },
    styleContent() {
      return {
        maxHeight: this.maxHeight,
      };
    },
  },
  watch: {
    maxHeight() {
      this.$parent.emitChange();
    },
    resizeCollapse() {
      this.changeHeight();
    },
  },
  mounted() {
    window.addEventListener('resize', this.changeHeight);
  },
  methods: {
    changeHeight() {
      const maxHeightx = this.$refs.content.scrollHeight;
      // eslint-disable-next-line eqeqeq
      if (this.maxHeight != '0px') {
        this.maxHeight = `${maxHeightx}px`;
      }
    },
    toggleContent() {
      if (this.openHover || this.disabled) {
        return;
      }

      if (this.accordion) {
        this.$parent.closeAllItems(this.$el);
      }

      const maxHeightx = this.$refs.content.scrollHeight;
      // eslint-disable-next-line eqeqeq
      if (this.maxHeight == '0px') {
        this.maxHeight = `${maxHeightx}px`;
      } else {
        this.maxHeight = '0px';
      }
    },
    mouseover() {
      if (this.disabled) {
        return;
      }
      const maxHeightx = this.$refs.content.scrollHeight;
      if (this.openHover) {
        this.maxHeight = `${maxHeightx}px`;
      }
    },
    mouseout() {
      if (this.openHover) {
        this.maxHeight = '0px';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-collapse-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
  margin-right: 16px;

  &.disabledx {
    opacity: 1;
    cursor: default;
    pointer-events: none;
    z-index: 999;
  }

  &:last-child {
    border-bottom: 0px solid rgba(0, 0, 0, 0) !important;
  }
}

.vs-collapse-item--header {
  display: block;
  padding: 10px 0;
  position: relative;
  transition: all 0.25s ease;
}

.vs-collapse-item--icon-header {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(-50%, -50%);
  display: block;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.vs-collapse-item--content {
  overflow: hidden;
  transition: all 0.2s ease;
  // box-shadow: inset 0px 0px 6px 0px rgba(0,0,0,.05)
}

.con-content--item {
  font-size: 0.85rem;
  // transform: translate(0,-20px)
  opacity: 1;
  transition: all 0.25s ease;
}

.open-item {
  .vs-collapse-item--icon-header {
    transform: translate(-50%, -50%) rotate(180deg);
  }
}

.icon-link {
  opacity: 0.7;
}
</style>
