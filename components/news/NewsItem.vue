<template>
  
    <div v-response.masked class="article" :style="`background-image: url(${article.image.src});`">
      <nuxt-link class="nuxt-link" :to="`/news/${article.pk}`">
      <div class="article-cover"></div>
      <div class="active-article">
        <div class="text-secondary">
          <div class="category">{{ article.category.name }}</div>
          <div class="date">
            {{ article.date_created.day }}
            {{ article.date_created.month }}
          </div>
        </div>
        <span class="article-title"><span class="link">{{ article.title }}</span></span>
      </div>
      <div class="flex"></div>
      </nuxt-link>
      <slot class="bullets-slot" name="bullets"></slot>
      
    </div>
  
</template>

<script>
export default {
  name: 'NewsItem',
  props: {
    article: {
      type: Object,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.article {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border-radius: 2px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.article-cover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
  opacity: 0.7;
  border-radius: 2px;
}
.active-article {
  position: relative;
  z-index: 1;
  padding: 16px;
  color: $body_color;
}
a {
  margin: 0;
  padding: 0;
  color: $body_color;
  text-decoration: none;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}
.article-title {
  font-size: 28px;
  line-height: 36px;
  letter-spacing: 0;
  font-weight: 300;
  font-family: $accent_font;
  text-decoration: none;
}
.text-secondary {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.15px;
  font-weight: 400;
  font-family: $accent_font;
  opacity: 0.7;
  margin-bottom: 8px;
  .date {
    margin-left: 8px;
    padding-bottom: 4px;
  }
  .category {
    padding-bottom: 4px;
    margin-right: 4px;
  }
}
.flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
}
.link {
  cursor: pointer;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $body_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease, color 1.6s ease-in-out;
}

.nuxt-link {
  height: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.nuxt-link:hover {
  .link {
    background-size: 100% 100%;
  }
}
</style>
