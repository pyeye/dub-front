<template>

  <div v-if="article" class="news-item" :style="'background-image: url('+ article.image.thumbnail +');'">
      <router-link :to="`/news/${article.pk}`">
      <div class="cover"></div>
      <div class="cover-text">
        
        <div class="title">{{ article.title }}</div>
        <div class="text-secondary">
          <div class="date">{{ article.date.day }} {{ article.date.month }}</div>
     
          <div class="category">{{ article.category.name }}</div>
         
        </div>
      </div>
      <div class="cover-inspect"><div>ПОДРОБНЕЕ</div><icon class="icon-link"  name="angle-right"></icon></div>
       </router-link>
  </div>
 
</template>

<script>


export default {
  name: 'DubNewsListItem',
  props: {
    article: {
      type: Object,
    },
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.news-item {
    cursor: pointer;
    border-radius: 2px;
    position: relative;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    transform: translateY(0);
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    transition: box-shadow .25s ease, transform .25s ease;

     &:hover {
        box-shadow: 0 5px 10px rgba(0,0,0,.2);
        transform: translateY(-2px);

        .cover {
            opacity: .9;
        }

        .cover-text {
            opacity: 0;
        }

        .cover-inspect {
            opacity: 1;
            -webkit-transform: translate3d(-50%,-50%,1px);
            transform: translate3d(-50%,-50%,1px);

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
    transition: opacity .25s ease;
    opacity: .65;
}

.cover-text {
   @include prefix((
     display: flex,
     flex-direction: column,
   ), webkit ms);
   position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    color: #fafafa;
    font-size: 1em;
    font-weight: 600;
    letter-spacing: .02em;
    line-height: 1em;
    font-family: 'Roboto', sans-serif; 
    padding: .7em;
    opacity: 1;
    transition: opacity .25s ease;


    .text-secondary {
        @include prefix((
          display: flex,
          flex-direction: row,
          align-items: center,
        ), webkit ms);
        font-size: .69em;
        line-height: .69em;
        margin-top: .5em;
        font-weight: 400;
        opacity: .85;

        .date {
            margin-right: 16px;
            padding-bottom: 4px;
        }

        .category {
            
            border-bottom: 2px solid $primary_color;
            color: $body_color;
            padding-bottom: 4px;
            font-size: 1em;
            letter-spacing: .2px;
        }
    }
}

.cover-inspect {
    color: $primary_color;
    font-size: 1em;
    font-weight: 600;
    letter-spacing: .03em;
    line-height: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    opacity: 0;
    transform: translate3d(-50%,-30%,1px);
    will-change: transfrom;
    transition: opacity .4s ease,transform .45s ease,-webkit-transform .45s ease;
     @include prefix((
          display: flex,
          flex-direction: row,
          align-items: center,
        ), webkit ms);
}

.icon-link { 
  width: 22px;
  height: 22px;
}

a {
    text-decoration: none;
}


</style>