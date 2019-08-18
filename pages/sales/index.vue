<template>
  <div class="news-list">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="news-header">
        <div class="title">Акции</div>
      </div>

      <div class="grid" >
        <div
          v-for="sale in sales"
          :key="sale.pk"
          class="news-item"
          :style="'background-image: url('+ sale.image.src +');'"
        >
          <nuxt-link :to="`/sales/${sale.pk}`">
            <div class="cover"></div>
            <div class="cover-text">
              <div class="text-secondary">
                <div class="date">
                  C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }} 
                  по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
                </div>
              </div>
              <div>{{ sale.name }}</div>
            </div>
            <div class="cover-inspect">
              <div>ПОДРОБНЕЕ</div>
              <dub-icon width=24 height=24><icon-right class="icon-link" /></dub-icon>
            </div>
          </nuxt-link>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SalesList',
  data: () => ({
    breadcrumbs: [{ label: 'Главная', link: '/' }, { label: 'Акции', link: '' }],
  }),
  computed: {
    sales() {
      return this.$store.getters['sales/sales'];
    },
    total() {
      return this.$store.getters['sales/total'];
    },
  },
  async fetch(context) {
    const { store } = context;
    await store.dispatch('sales/requestSales');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-list {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
}
.news-header {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
    ),
    webkit ms
  );
  margin: 24px 0;
  .title {
    @include prefix(
      (
        flex: 1,
      ),
      webkit ms
    );

    font-size: 38px;
    font-weight: 600;
    letter-spacing: 0.025em;
    line-height: 42px;
    font-family: $accent_font;
  }
}
.grid {
  @include prefix(
    (
      display: flex,
      flex-wrap: wrap,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );

  width: 100%;
  margin: 0 0 32px 0;
}

@media (max-width: 1450px) {
  .news-list {
    width: 85%;
  }
}
.news-item {
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  margin-bottom: 24px;
  width: 49%;
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform: translateY(0);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    .cover {
      opacity: 0.9;
    }
    .cover-text {
      opacity: 0;
    }
    .cover-inspect {
      opacity: 1;
      -webkit-transform: translate3d(-50%, -50%, 1px);
      transform: translate3d(-50%, -50%, 1px);
    }
  }
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
  font-size: 32px;
  letter-spacing: 0.25px;
  line-height: 32px;
  font-family: $accent_font;
  padding: 16px;
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
    letter-spacing: 0.15px;
    line-height: 16px;
    opacity: 0.85;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
  }
}
.cover-inspect {
  color: $primary_color;
  font-size: 24px;
  letter-spacing: 0.25px;
  line-height: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate3d(-50%, -30%, 1px);
  will-change: transfrom;
  transition: opacity 0.4s ease, transform 0.45s ease, -webkit-transform 0.45s ease;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}
.icon-link {
  width: 22px;
  height: 22px;
}
a {
  text-decoration: none;
}
</style>
