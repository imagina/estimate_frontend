//Layout container
import master from 'src/layouts/master'
import notFound from 'src/layouts/404'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  //Form estimates
  create: {
    permission: null,
    activated: true,
    path: '/estimate/create',
    name: 'estimate.create',
    layout: require('src/layouts/estimate/form').default,
    containerLayout: master,
    title: 'sidebar.estimate.title',
    icon: 'fas fa-home',
    middleware: [auth]
  }
}
