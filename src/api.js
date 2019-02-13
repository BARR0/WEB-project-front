import axios from 'axios';
import qs from 'query-string';

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
  async createPlayer(name){
    let data = qs.stringify({
      name
    });
    return client.post('player', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(response => {
        return response.data;
      }).catch(err => {
        return err;
      })
  },
  async putPlayer(id, moves){
    let data = qs.stringify(moves);
    return client.put(`player/${id}`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(response => {
        return response.data;
      }).catch(err => {
        return {id, err};
      })
  },
};