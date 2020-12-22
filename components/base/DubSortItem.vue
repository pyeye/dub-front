<template>
  <div class="sort-item" @click="nextSortDirection">
    <div>
        <div
          v-if="sortActive.direction === 'none' || sortActive.code !== sortOption.code"
          key='none'
        >
          <div class="none"></div>
        </div>
        <div 
          v-if="sortActive.direction === 'asc' && sortActive.code === sortOption.code"
          key='asc'
          class="icon">
          <dub-icon  width=16 height=20 ><icon-arrow-down/></dub-icon>
        </div>
        <div
        v-if="sortActive.direction === 'desc' && sortActive.code === sortOption.code" key='desc' class="icon">
          <dub-icon  width=16 height=20 class="icon-up"><icon-arrow-down/></dub-icon>
        </div>
      
    </div>
    <span class="sort-option-label">
      <span
        class="label"
        :class="{'sort-active': sortOption.code === sortActive.code && sortActive.direction !== 'none'}"
      >
        {{sortOption.label}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'DubSortItem',
  props: {
    sortOption: {
      type: Object,
      required: true,
    },
    sortActive: {
      type: Object,
    },
  },
  data: () => ({
    directionActive: 0,
    sortDirections: ['none', 'asc', 'desc'],
  }),
  methods: {
    nextSortDirection() {
      let nextDirectionIndex = 0;
      if (this.sortActive.code === this.sortOption.code) {
        const currentDirectionIndex = this.sortDirections.indexOf(this.sortActive.direction);
        nextDirectionIndex = Math.abs(currentDirectionIndex + 1) % this.sortDirections.length;
      } else {
        nextDirectionIndex = 1;
      }
      const direction = this.sortDirections[nextDirectionIndex];
      this.$emit('change-direction', direction);
    },
  },
};
</script>

<style lang="scss" scoped>
.sort-item {
  cursor: pointer;
  margin-left: 12px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: flex-end,
    ),
    webkit ms
  );
}
.sort-option-label {
  text-decoration: none;
  color: $text_color;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.16px;

  .label {
    width: calc(100%);
    background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 0.3s ease;
    height: 100%;
    &:hover {
      background-size: 100% 100%;
    }
  }
  .sort-active {
    background-size: 100% 100%;
  }
}

.icon {
  width: 16px;
  height: 18px;
  color: $text_color;
  margin-right: -2px;
  margin-top: 2px;
}
.icon-up {
  transform: rotate(180deg);
}
.icon-down {
  transform: rotate(-90deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
