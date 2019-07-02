import axios from 'axios';

export default (ctx, inject) => {
  const formatFacet = facet => (facet !== undefined && !Array.isArray(facet) ? [facet] : facet);

  const axiosExtra = {
    setHeader(name, value, scope = 'common') {
      this.defaults.headers[scope][name] = value;
    },
    setGuestToken(token) {
      const value = `JWT ${token}`;
      this.setHeader('Authorization', value);
    },

    // Product API
    async getProducts(payload) {
      const { category, query = {} } = payload;
      let { sfacets, nfacets } = query;
      const { tags, page, sort } = query;
      sfacets = formatFacet(sfacets);
      nfacets = formatFacet(nfacets);
      const response = await this.get('products/', {
        params: {
          category,
          tags,
          sfacets,
          nfacets,
          page,
          sort,
        },
      });
      return response.data;
    },
    async getFacets(payload) {
      const { category, query = {} } = payload;
      let { sfacets, nfacets } = query;
      sfacets = formatFacet(sfacets);
      nfacets = formatFacet(nfacets);
      const response = await this.get('facets/', {
        params: {
          category,
          sfacets,
          nfacets,
        },
      });
      return response.data;
    },
    async getAllFacetValues(payload) {
      const { category, facet, query = {} } = payload;
      let { sfacets } = query;
      sfacets = formatFacet(sfacets);
      const response = await this.get('facet/full/', {
        params: {
          facet,
          category,
          sfacets,
        },
      });
      return response.data;
    },
    async getTags(payload) {
      const { category } = payload;
      const response = await this.get('tags/', {
        params: {
          category,
        },
      });
      return response.data;
    },
  };

  const api = axios.create({
    baseURL: 'http://api.mydubbelsite.ru/v1/',
  });

  Object.keys(axiosExtra).forEach(key => {
    api[key] = axiosExtra[key].bind(api);
  });

  inject('api', api);
};
