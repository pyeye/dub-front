<template>
  <div class="catalog-item">
    <div class="link-box">
      <div class="image-box">
        <router-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">
          <img class="image" :src="product.main_image.thumbnail">
        </router-link>
      </div>
      <div class="name"> 
        <router-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">
          {{ product.name }}, {{selectedPrice.count}}{{selectedPrice.measure}}  
        </router-link>
      </div>
      <div class="prices">
        <div class="price">
          {{selectedPrice.value}} &#x20bd; 
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'DubHomeBestsellersItem',
  props: {
    product: {
      type: Object,
    },
    category: {
      type: Object,
    },
  },
  data: () => ({
    selectedPrice: {},
  }),
  computed: {
  },
  watch: {
    product: {
      immediate: true,
      handler(val) {
        this.selectedPrice = val.prices[0];
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.catalog-item {
    position: relative;
   
      background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      padding: 24px;
      transition: box-shadow .25s ease;
      height: 100%;

      &:hover {
        box-shadow: 0 5px 10px rgba(0,0,0,.2)
      }

      .link-box{
        @include prefix((
          display: flex,
          flex-direction: column,
        ), webkit ms);
        height: 100%;

        text-decoration: none;
        color: $text_color;

        .image-box {
          @include prefix((
            align-self: center,
            flex: 1,
          ), webkit ms);
        }

        .image {
          height: 220px;  
        }

        .name {
          text-align: center;
          padding: 16px 0 8px 0;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -.012em;
          line-height: 16px;
        }
      }
    
}


.prices {
    @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: center,
      align-items: center,
    ), webkit ms);

    

    .price {
      font-family: 'Roboto', sans-serif;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -.012em;
        line-height: 18px;
    }
}

a {
  text-decoration: none;
  color: $text_color;
}

</style>