
<template>
  <div
    :style="stylePagination"
    :class="[`vs-pagination-${color}`]"
    class="con-vs-pagination">
    <nav class="vs-pagination--nav">
      <button
        :class="{disabled:current <= 1 ? 'disabled' : null}"
        :disabled="current === 1"
        class="vs-pagination--buttons btn-prev-pagination vs-pagination--button-prev"
        @click="prevPage">
        <dub-icon class="icon"><icon-left/></dub-icon>
      </button>
      <ul class="vs-pagination--ul">
        <li
          v-for="(page, index) in pages"
          :key="index"
          :class="{'is-current': page == current}"
          class="item-pagination vs-pagination--li"
          @click="goTo(page)">
          <span>
            {{ page }}
          </span>

          <div class="effect"></div>
        </li>
      </ul>
      <!-- :style="styleBtn" -->
      <button
        :class="{disabled:current === total ? 'disabled' : null}"
        :disabled="current === total"
        class="vs-pagination--buttons btn-next-pagination vs-pagination--button-next"
        @click="nextPage">
        <dub-icon class="icon"><icon-right/></dub-icon>
      </button>
      <input
        v-if="goto"
        v-model="go"
        :max="total"
        class="vs-pagination--input-goto"
        min="1"
        type="number"
        @change="goTo">
    </nav>
  </div>
</template>
<script>
/* eslint-disable no-plusplus */

export default {
  name: 'DubPagination',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    total: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      default: 1,
    },
    max: {
      type: Number,
      default: 9,
    },
    goto: {
      type: Boolean,
    },
    type: {
      type: String,
    },
    prevIcon: {
      type: String,
      default: 'chevron_left',
    },
    nextIcon: {
      type: String,
      default: 'chevron_right',
    },
    iconPack: {
      type: String,
      default: 'material-icons',
    },
  },
  data: () => ({
    pages: [],
    current: 1,
    go: 0,
    prevRange: '',
    nextRange: '',
    hoverBtn1: false,
  }),
  computed: {
    stylePagination() {
      let style = {};
      style = {
        '--vs-color-pagination': '#fc0',
        '--vs-color-pagination-alpha': '#fc0',
      };

      return style;
    },
  },
  watch: {
    current() {
      this.getPages();
      this.$emit('input', this.current);
      this.$emit('change', this.current);
    },
    total() {
      this.getPages();
    },
    value(val) {
      // eslint-disable-next-line no-nested-ternary
      const pageNum = val < 1 ? 1 : val <= this.total ? val : this.total;
      this.goTo(pageNum);
    },
  },

  mounted() {
    // eslint-disable-next-line no-multi-assign
    this.current = this.go = this.value;
    this.getPages();
  },

  methods: {
    isEllipsis(page) {
      return page === '...';
    },
    goTo(page) {
      if (page === '...') {
        return;
      }
      if (typeof page.target === 'undefined') {
        this.current = page;
      } else {
        const value = parseInt(page.target.value, 10);
        // eslint-disable-next-line no-nested-ternary
        this.go = value < 1 ? 1 : value <= this.total ? value : this.total;
        this.current = this.go;
      }
    },
    getPages() {
      if (this.total <= this.max) {
        const pages = this.setPages(1, this.total);
        this.pages = pages;
      }
      const even = this.max % 2 === 0 ? 1 : 0;
      if (this.total < 6) {
        this.prevRange = Math.floor(this.max / (this.max / 2));
      } else {
        this.prevRange = Math.floor(this.max / 2);
      }
      this.nextRange = this.total - this.prevRange + 1 + even;

      if (this.current >= this.prevRange && this.current <= this.nextRange) {
        const start = this.current - this.prevRange + 2;
        const end = this.current + this.prevRange - 2 - even;

        this.pages = [1, '...', ...this.setPages(start, end), '...', this.total];
      } else if (this.total < 6) {
        this.pages = [...this.setPages(1, this.total)];
      } else {
        this.pages = [
          ...this.setPages(1, this.prevRange),
          '...',
          ...this.setPages(this.nextRange, this.total),
        ];
      }
    },
    setPages(start, end) {
      const setPages = [];

      // eslint-disable-next-line no-param-reassign
      for (start > 0 ? start : 1; start <= end; start++) {
        setPages.push(start);
      }

      return setPages;
    },
    nextPage() {
      if (this.current < this.total) {
        this.current++;
      }
    },
    prevPage() {
      if (this.current > 1) {
        this.current--;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.con-vs-pagination {
  --color-pagination: rgb(240, 240, 240);
  --color-pagination-alpha: rgb(240, 240, 240, 0.5);
}
.vs-pagination--input-goto {
  padding: 8px;
  border: 0px solid rgba(0, 0, 0, 0.2);
  background: rgb(240, 240, 240);
  margin-left: 5px;
}
.vs-pagination--nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.vs-pagination--ul {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  background: $overlay_color;
  padding-left: 5px;
  padding-right: 5px;
}

.vs-pagination--li {
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  position: relative;
  backface-visibility: visible;
  margin: 0px 2px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  span {
    z-index: 100;
  }
  .effect {
    z-index: 50;
    content: '';
    position: absolute;
    width: 80%;
    height: 90%;
    background: $overlay_color;
    left: 50%;
    top: 0px;
    display: block;
    transform: scale(0.5) translateX(-50%);
    opacity: 0;
    transition: all 0.2s ease;
  }
  &.is-current {
    transform: scale(1.05);
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
    cursor: default;
    background: $overlay_color;
    .effect {
      opacity: 1;
      transform: scale(1) translateX(-50%) !important;
    }
  }
  &:hover:not(.is-current) {
    color: $text_color;
  }
}

.vs-pagination--buttons {
  width: 35px;
  height: 35px;
  border: 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.6);
  transition: all 0.2s ease;
  margin: 0px;
  z-index: 200;
  &.vs-pagination--button-prev {
    margin-right: 5px;
    background-color: $overlay_color;
  }
  &.vs-pagination--button-next {
    margin-left: 5px;
    background-color: $overlay_color;
  }
  &.disabled,
  &:disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.5;
  }
  i {
    font-size: 1.2rem;
  }
  &:hover {
    color: rgba(0, 0, 0, 0.6);
  }
}

.vs-pagination-primary {
  li {
    &:hover:not(.is-current) {
      color: $text_color !important;
    }
  }
  .effect {
    background: $overlay_color !important;
    border-bottom: 2px solid rgba(0, 0, 0, 0.8) !important;
  }
}
</style>
