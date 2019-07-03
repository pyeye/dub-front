import axios from 'axios';

export default (ctx, inject) => {
  const formatFacet = facet => (facet !== undefined && !Array.isArray(facet) ? [facet] : facet);
  const getFilterParams = payload => {
    const { category, sales, query = {} } = payload;
    let { sfacets, nfacets } = query;
    const { tags } = query;
    sfacets = formatFacet(sfacets);
    nfacets = formatFacet(nfacets);
    return {
      category,
      tags,
      sfacets,
      nfacets,
      sales,
    };
  };

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
      const { query = {} } = payload;
      const { page, sort } = query;
      const params = getFilterParams(payload);
      params.page = page;
      params.sort = sort;
      const response = await this.get('products/', { params });
      return response.data;
    },
    async getFacets(payload) {
      const params = getFilterParams(payload);
      const response = await this.get('facets/', { params });
      return response.data;
    },
    async getAllFacetValues(payload) {
      const { facet } = payload;
      const params = getFilterParams(payload);
      params.facet = facet;
      const response = await this.get('facet/full/', { params });
      return response.data;
    },
    async getTags(payload) {
      const params = getFilterParams(payload);
      const response = await this.get('tags/', { params });
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
