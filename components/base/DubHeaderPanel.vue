<template>
  <div 
    class="header-panel" 
    v-if="navActive || selfActive" 
    @mouseover="selfActive = true" 
    @mouseout="selfActive = false"
  >
    <div class="panel-content">
        <div class="content-categories">
            <div class="categories-list">
                <div v-for="category in categories" :key="category.pk">
                    <router-link :to="'/catalog/' + category.code">
                        <div class="link" @click="selfActive = false">{{ category.name }}</div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="content-meta"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DubHeaderPanel',
  props: {
    categories: {
      type: Array,
    },
    navActive: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    selfActive: false,
  }),
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header-panel {
  width: 80%;
  min-height: 300px;
  background-color: #fafafa;
  position: absolute;
  border-radius: 0 0 3px 3px;
  left: 10%;
  z-index: 2;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 24px 0;
}
.panel-content {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .content-categories {
    border-right: 2px solid #e6e3da;
    width: 15%;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 24px;
    position: relative;
    min-height: 300px;
    text-align: right;
    .categories-list {
      padding: 4px 0;
      a {
        text-decoration: none;
        color: $text_color;
      }
      .link {
        padding: 4px 24px;
      }
      .link:hover {
        border-right: 2px solid $primary_color;
        margin-right: -2px;
      }
    }
  }
  .content-meta {
    width: 85%;
  }
}
</style>
