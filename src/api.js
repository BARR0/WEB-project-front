import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8081',
});

export default {
  async getUniverse(){
    return client.get('universe').then(response => {
        return response.data;
      }).catch(err => {
        return err;
      })
  },
};