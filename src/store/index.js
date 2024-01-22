import { createStore } from 'vuex'
import dataSource from '@/data.json'

export default createStore({
  state: dataSource
})
