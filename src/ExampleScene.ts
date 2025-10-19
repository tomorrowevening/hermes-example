import { hierarchyUUID } from '@tomorrowevening/hermes';
import { BoxGeometry, Clock, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, Vector3 } from 'three';

export default class ExampleScene extends Scene {
  static name = 'Example';

  camera: PerspectiveCamera;
  cameraTarget = new Vector3();
  clock = new Clock();

  constructor() {
    super();
    this.name = ExampleScene.name;

    this.camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 2000);
    this.camera.name = 'exampleCamera';
    this.camera.position.z = 10;
    this.add(this.camera);

    const box = new Mesh(new BoxGeometry(3, 3, 3), new MeshNormalMaterial({ name: 'normals' }));
    box.name = 'box';
    this.add(box);

    hierarchyUUID(this);

    this.clock.start();
  }

  update() {
    const radius = 10;
    const elapsed = this.clock.getElapsedTime();
    this.camera.position.x = Math.cos(elapsed) * radius;
    this.camera.position.y = Math.sin(elapsed) * 3;
    this.camera.position.z = Math.sin(elapsed) * radius;
    this.camera.lookAt(this.cameraTarget);
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
