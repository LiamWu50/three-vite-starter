import {
  Mesh,
  MeshNormalMaterial,
  Object3D,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3
} from 'three'

import Paddle from './paddle'

export default class Ball {
  private scene: Scene
  private paddles: Paddle[]
  private bodundaries: Vector2
  private radius = 0.5
  private geometry: SphereGeometry
  private material: MeshNormalMaterial
  public mesh: Mesh
  private speed = 5
  private velocity: Vector3 = new Vector3(1, 0, 0.5)
  private raycaster = new Raycaster()

  constructor(scene: Scene, bodundaries: Vector2, paddles: Paddle[]) {
    this.scene = scene
    this.paddles = paddles
    this.bodundaries = bodundaries
    this.geometry = new SphereGeometry(this.radius)
    this.material = new MeshNormalMaterial()
    this.mesh = new Mesh(this.geometry, this.material)

    this.velocity.multiplyScalar(this.speed)

    this.raycaster.near = 0
    this.raycaster.far = this.bodundaries.y * 2.5

    this.scene.add(this.mesh)
  }

  public update(dt: number) {
    const dir = this.velocity.clone().normalize()
    this.raycaster.set(this.mesh.position, dir)

    const s = this.velocity.clone().multiplyScalar(dt)
    const tPos = this.mesh.position.clone().add(s)
    const dx = this.bodundaries.x - this.radius - Math.abs(this.mesh.position.x)
    const dz = this.bodundaries.y - this.radius - Math.abs(this.mesh.position.z)

    if (dx <= 0) {
      tPos.x =
        (this.bodundaries.x - this.radius + dx) *
        Math.sign(this.mesh.position.x)

      this.velocity.x *= -1
    }

    if (dz < 0) {
      tPos.set(0, 0, 0)
      this.velocity.z *= -1
    }

    const paddle = this.paddles.find(
      (paddle) =>
        Math.sign(paddle.mesh.position.z) === Math.sign(this.velocity.z)
    )

    console.log('paddle', paddle)

    const [intersection] = this.raycaster.intersectObjects(
      paddle?.mesh.children as Object3D[]
    )

    this.mesh.position.copy(tPos)
  }
}
