import Vue from 'vue';

const state = () => ({
  products: {},
  categories: [],
  tags: {},
  facets: {},
  total: 0,
});

const getters = {
  products: state => category => state.products[category] || null,
  product: (state, getters) => (category, id) => {
    const products = getters.products(category);
    let product;
    try {
      product = products.find(item => item.pk.toString() === id);
    } catch (e) {
      product = null;
    }
    // if products selected category empty return none
    return product;
  },
  categories: state => state.categories,
  category: (state, getters) => slug => getters.categories.find(category => category.slug === slug),
  tags: state => category => state.tags[category] || null,
  facets: state => category => state.facets[category] || null,
  total: state => state.total,
};
const actions = {
  async requestProducts(store, payload) {
    const { commit } = store;
    const { category, query = {} } = payload;
    let { sfacets, nfacets } = query;
    const { tags, page, sort } = query;
    if (sfacets !== undefined && !Array.isArray(sfacets)) {
      sfacets = [sfacets];
    }
    if (nfacets !== undefined && !Array.isArray(nfacets)) {
      nfacets = [nfacets];
    }
    const { data } = await this.$api.get('products/', {
      params: {
        category,
        tags,
        sfacets,
        nfacets,
        page,
        sort,
      },
    });
    commit('setProducts', {
      products: data.items,
      category,
    });
    commit('setTotal', {
      total: data.total,
    });
  },
  async requestCategories({ commit }) {
    const { data } = await this.$api.get('category/');
    commit('setCategories', data);
  },
  async requestTags({ commit }, payload) {
    const { category } = payload;
    const { data } = await this.$api.get('tags/', {
      params: {
        category,
      },
    });
    commit('setProductTags', {
      tags: data,
      category,
    });
  },
  async requestFacets(store, payload) {
    const { commit } = store;
    const { category, query = {} } = payload;
    let { sfacets, nfacets } = query;
    if (sfacets !== undefined && !Array.isArray(sfacets)) {
      sfacets = [sfacets];
    }
    if (nfacets !== undefined && !Array.isArray(nfacets)) {
      nfacets = [nfacets];
    }
    const { data } = await this.$api.get('facets/', {
      params: {
        category,
        sfacets,
        nfacets,
      },
    });
    commit('setProductFacets', {
      facets: data,
      category,
    });
  },
};
const mutations = {
  setProducts(state, { products, category }) {
    Vue.set(state.products, category, products);
  },
  setTotal(state, payload) {
    const { total } = payload;
    state.total = total;
  },
  setProductTags(state, { tags, category }) {
    Vue.set(state.tags, category, tags);
  },
  setProductFacets(state, { facets, category }) {
    Vue.set(state.facets, category, facets);
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
