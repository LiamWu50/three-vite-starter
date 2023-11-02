import './styles/index.css'

import ThreeSceneCreator from '@/helpers/three-scene-creator'

const initScene = () => {
  const container = document.getElementById('container')
  ThreeSceneCreator.init(container as HTMLDivElement)
}

initScene()
