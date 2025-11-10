import { createRouter, createWebHistory } from 'vue-router'
import ExperimentsList from '../views/ExperimentsList.vue'
import ExperimentDetail from '../views/ExperimentDetail.vue'
import AddExperiment from '../views/AddExperiment.vue'
import EditExperiment from '../views/EditExperiment.vue'

const routes = [
  {
    path: '/',
    name: 'experiments',
    component: ExperimentsList,
  },
  {
    path: '/experiments/add',
    name: 'add-experiment',
    component: AddExperiment,
  },
  {
    path: '/experiments/:id/edit',
    name: 'edit-experiment',
    component: EditExperiment,
    props: true,
  },
  {
    path: '/experiments/:id',
    name: 'experiment-detail',
    component: ExperimentDetail,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

