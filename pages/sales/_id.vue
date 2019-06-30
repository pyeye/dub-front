<template>
  <div class="news-detail">
     <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="detail-content">
      <div class="hero" :style="'background-image: url('+ sale.image.src +');'">
        <div class="cover"></div>
        <div class="cover-text">
          <div class="title">{{ sale.name }}</div>
          <div class="text-secondary">
            <div class="date">
              {{ sale.fdate_start.day }}
              {{ sale.fdate_start.month }}
              {{ sale.fdate_start.year }}
            </div>
          </div>
        </div>
      </div>
      <div class="description">
        {{ sale.description }}
      </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'DubSaleDetail',
  async asyncData({ store, params, app }) {
    const { id } = params;
    let sale = store.getters['sales/sale'](id);
    if (!sale) {
      const url = `sales/${id}/`;
      const { data } = await app.$api.get(url);
      sale = data;
    }
    return {
      sale,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Акции', link: '/news' },
        { label: this.sale.name, link: '' },
      ];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-detail {
  position: relative;
  width: 80%;
  margin: 0 auto;
}
.detail-content {
  position: relative;
  margin: 24px auto;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.hero {
  position: relative;
  width: 100%;
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.65;
}
.cover-text {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  color: #fafafa;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-family: 'Roboto', sans-serif;
  padding: 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
  .text-secondary {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: center,
      ),
      webkit ms
    );
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    font-weight: 400;
    opacity: 0.85;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
    .category {
      border-bottom: 2px solid $primary_color;
      color: $body_color;
      padding-bottom: 4px;
      font-size: 1em;
      letter-spacing: 0.2px;
    }
  }
}
.description {
  padding: 24px;
  font-size: 14px;
}
.icon-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  font-weight: 400;
  width: 28px;
  height: 28px;
  color: $body_color;
}
a {
  text-decoration: none;
}
@media (max-width: 1450px) {
  .news-detail {
    width: 85%;
  }
}
</style>
