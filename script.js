import * as THREE from "./vendor/three.js-master/build/three.module.js";
import { OrbitControls } from "./vendor/three.js-master/examples/jsm/controls/OrbitControls.js";
import Stats from "./vendor/three.js-master/examples/jsm/libs/stats.module.js";
import { FBXLoader } from "./vendor/three.js-master/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "./vendor/three.js-master/examples/jsm/loaders/OBJLoader.js";

const Scene = {
  vars: {
    container: null,
    scene: null,
    renderer: null,
    camera: null,
    stats: null,
    controls: null,
    texture: null,
    texture_sol: null,
    mouse: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    animSpeed: 0,
    animPurcent: 0,
    text: null
  },
  init: () => {
    let vars = Scene.vars;

    // Preparer le container de la scene
    vars.container = document.createElement("div");
    vars.container.classList.add("fullscreen");
    document.body.appendChild(vars.container);

    // creer une scene
    vars.scene = new THREE.Scene();
    vars.scene.background = new THREE.Color(0xa0a0a0);

    // moteur de rendus
    vars.renderer = new THREE.WebGLRenderer({ antialias: true });
    vars.renderer.setPixelRatio(window.devicePixelRatio);
    vars.renderer.setSize(window.innerWidth, window.innerHeight);
    vars.renderer.shadowMap.enabled = true;
    vars.renderer.shadowMapSoft = true;
    vars.container.appendChild(vars.renderer.domElement);

    // creer une camera
    vars.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    vars.camera.position.set(-1.5, 300, 572);

    // creer une lumiere
    let light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    light.position.set(0, 700, 0);
    //light.castShadow = true;

    vars.scene.add(light);

    // creer un sol
    //Import des textures

    vars.texture_sol = new THREE.TextureLoader().load(
      "./textures/plancher.jpg"
    );
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshLambertMaterial({
        map: vars.texture_sol
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = false;
    vars.scene.add(mesh);

    let planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.07;
    let shadowPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      planeMaterial
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    vars.scene.add(shadowPlane);

    // // ajouter des textures helper au sol
    // let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // vars.scene.add(grid);

    // creation de la bulle
    let geometry = new THREE.SphereGeometry(1000, 32, 32);
    let material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xaaaaaa)
    });
    material.side = THREE.DoubleSide;
    let sphere = new THREE.Mesh(geometry, material);
    vars.scene.add(sphere);

    // ajout des lumieres directionnelles et ses ombres
    let lightIntensity = 0.4;
    let directional1 = new THREE.DirectionalLight(0xffffff, lightIntensity);
    let directional2 = new THREE.DirectionalLight(0xffffff, lightIntensity);
    let directional3 = new THREE.DirectionalLight(0xffffff, lightIntensity);

    directional1.position.set(0, 700, 0);
    directional2.position.set(-400, 200, 400);
    directional3.position.set(400, 200, 400);

    directional1.castShadow = true;
    let d = 1000;
    directional1.shadow.camera.left = -d;
    directional1.shadow.camera.right = d;
    directional1.shadow.camera.top = d;
    directional1.shadow.camera.bottom = -d;
    directional1.shadow.camera.far = 2000;
    directional1.shadow.mapSize.width = 4096;
    directional1.shadow.mapSize.height = 4096;

    directional2.castShadow = true;
    let d2 = 1000;
    directional2.shadow.camera.left = -d2;
    directional2.shadow.camera.right = d2;
    directional2.shadow.camera.top = d2;
    directional2.shadow.camera.bottom = -d2;
    directional2.shadow.camera.far = 2000;
    directional2.shadow.mapSize.width = 4096;
    directional2.shadow.mapSize.height = 4096;

    directional3.castShadow = true;
    let d3 = 1000;
    directional3.shadow.camera.left = -d3;
    directional3.shadow.camera.right = d3;
    directional3.shadow.camera.top = d3;
    directional3.shadow.camera.bottom = -d3;
    directional3.shadow.camera.far = 2000;
    directional3.shadow.mapSize.width = 4096;
    directional3.shadow.mapSize.height = 4096;

    vars.scene.add(directional1);
    vars.scene.add(directional2);
    vars.scene.add(directional3);

    let helper = new THREE.DirectionalLightHelper(directional1, 5);
    let helper2 = new THREE.DirectionalLightHelper(directional2, 5);
    let helper3 = new THREE.DirectionalLightHelper(directional3, 5);

    vars.scene.add(helper);
    vars.scene.add(helper2);
    vars.scene.add(helper3);
    // // recup texte url
    // let hash = document.location.hash.substr(1);
    // if (hash.length !== 0) {
    //   var texthash = hash.substring();
    //   Scene.vars.text = decodeURI(texthash);
    // } else {
    //   Scene.vars.text = "DAWIN";
    // }

    document.querySelector("#loading").remove();
    Scene.loadFBX(
      "sapin.fbx",
      0.6,
      [0, 110, 0],
      [0, 0, 0],
      0xffffff,
      "sapin",
      () => {
        Scene.loadFBX(
          "cadeaux.fbx",
          1.8,
          [0, 0, 0],
          [0, 0, 0],
          0xaaaaaa,
          "cadeaux",
          () => {
            Scene.loadFBX(
              "boule.fbx",
              0.1,
              [0, 0, 120],
              [0, 0, 0],
              0x1aff22,
              "bouleA",
              () => {
                Scene.loadFBX(
                  "boule.fbx",
                  0.1,
                  [0, 0, 130],
                  [0, 0, 0],
                  0xfffffa,
                  "bouleB",
                  () => {
                    let sapin = new THREE.Group();
                    sapin.add(Scene.vars.sapin);
                    vars.scene.add(sapin);

                    let cadeaux_1 = new THREE.Group();
                    cadeaux_1.add(Scene.vars.cadeaux);
                    vars.scene.add(cadeaux_1);

                    let cadeaux_2 = cadeaux_1.clone();
                    cadeaux_2.position.z = 145;
                    vars.scene.add(cadeaux_2);

                    let cadeaux_3 = cadeaux_1.clone();
                    cadeaux_3.position.z = 45;
                    vars.scene.add(cadeaux_3);

                    let boule_1 = new THREE.Group();
                    boule_1.add(Scene.vars.bouleA);
                    boule_1.add(Scene.vars.bouleB);
                    vars.scene.add(boule_1);

                    let boule_2 = boule_1.clone();
                    boule_2.position.y = 65;
                    vars.scene.add(boule_2);

                    let boule_3 = boule_1.clone();
                    boule_3.position.y = 55;
                    vars.scene.add(boule_3);

                    let boule_4 = boule_1.clone();
                    boule_4.position.y = 45;
                    vars.scene.add(boule_4);

                    document.querySelector("#loading").remove();
                  }
                );

                // let cadeaux_3 = cadeaux_1.clone();
                // cadeaux_3.position.z = 45;
                // vars.scene.add(cadeaux_3);
              }
            );
          }
        );
      }
    );
    // chargement des objets
    // Scene.loadFBX(
    //   "Socle_Partie1.FBX",
    //   10,
    //   [0, 0, 0],
    //   [0, 0, 0],
    //   0x1a1a1a,
    //   "socle1",
    //   () => {
    //     Scene.loadFBX(
    //       "Socle_Partie2.FBX",
    //       10,
    //       [0, 0, 0],
    //       [0, 0, 0],
    //       0x1a1a1a,
    //       "socle2",
    //       () => {
    //         Scene.loadFBX(
    //           "Statuette.FBX",
    //           10,
    //           [0, 0, 0],
    //           [0, 0, 0],
    //           0xffd700,
    //           "statuette",
    //           () => {
    //             Scene.loadFBX(
    //               "Plaquette.FBX",
    //               10,
    //               [0, 4, 45],
    //               [0, 0, 0],
    //               0xffffff,
    //               "plaquette",
    //               () => {
    //                 Scene.loadFBX(
    //                   "Logo_Feelity.FBX",
    //                   10,
    //                   [45, 22, 0],
    //                   [0, 0, 0],
    //                   0xffffff,
    //                   "logo",
    //                   () => {
    //                     Scene.loadText(
    //                       "DAWIN",
    //                       10,
    //                       [0, 23, 46],
    //                       [0, 0, 0],
    //                       0x1a1a1a,
    //                       "texte",
    //                       () => {
    //                         // positionnement trophée
    //                         let trophy = new THREE.Group();
    //                         trophy.add(Scene.vars.socle1);
    //                         trophy.add(Scene.vars.socle2);
    //                         trophy.add(Scene.vars.statuette);
    //                         trophy.add(Scene.vars.plaquette);
    //                         trophy.add(Scene.vars.texte);

    //                         let logo2 = Scene.vars.logo.clone();
    //                         logo2.rotation.z = Math.PI;
    //                         logo2.position.x = -45;

    //                         Scene.vars.logo2 = logo2;
    //                         trophy.add(Scene.vars.logo);
    //                         trophy.add(logo2);

    //                         vars.scene.add(trophy);
    //                         Scene.vars.animSpeed = -0.05;

    //                         trophy.position.z = -50;
    //                         trophy.position.y = 10;
    //                         Scene.vars.goldGroup = trophy;

    //                         let trophy2 = trophy.clone();
    //                         trophy2.position.x = -200;
    //                         trophy2.position.y = 10;
    //                         trophy2.rotation.y = Math.PI / 4;

    //                         trophy2.children[2].traverse(node => {
    //                           if (node.isMesh) {
    //                             node.material = new THREE.MeshStandardMaterial({
    //                               color: new THREE.Color(0xc0c0c0),
    //                               roughness: 0.3,
    //                               metalness: 0.6
    //                             });

    //                             node.material.color = new THREE.Color(0xc0c0c0);
    //                           }
    //                         });
    //                         vars.scene.add(trophy2);
    //                         Scene.vars.animSpeed = -0.05;
    //                         Scene.vars.silverGroupe = trophy2;

    //                         let trophy3 = trophy.clone();
    //                         trophy3.position.x = 200;
    //                         trophy3.position.y = 10;
    //                         trophy3.rotation.y = -Math.PI / 4;
    //                         trophy3.children[2].traverse(node => {
    //                           if (node.isMesh) {
    //                             node.material = new THREE.MeshStandardMaterial({
    //                               color: new THREE.Color(0xcd7f32),
    //                               roughness: 0.3,
    //                               metalness: 0.6
    //                             });

    //                             node.material.color = new THREE.Color(0xcd7f32);
    //                           }
    //                         });

    //                         vars.scene.add(trophy3);
    //                         Scene.vars.animSpeed = -0.05;
    //                         Scene.vars.bronzeGroupe = trophy3;

    //                         document.querySelector("#loading").remove();
    //                       }
    //                     );
    //                   }
    //                 );
    //               }
    //             );
    //           }
    //         );
    //       }
    //     );
    //   }
    // );

    // gestion redimensionnement
    window.addEventListener("resize", Scene.onWindowResize, false);

    // mise en place controles
    vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
    vars.controls.minDistance = 300;
    vars.controls.maxDistance = 600;
    // vars.controls.minPolarAngle = Math.PI / 4;
    // vars.controls.maxPolarAngle = Math.PI / 2;
    // vars.controls.minAzimuthAngle = -Math.PI / 4;
    // vars.controls.maxAzimuthAngle = Math.PI / 4;
    vars.controls.target.set(0, 100, 0);
    vars.controls.update();

    // ajout des stats
    vars.stats = new Stats();
    vars.container.appendChild(vars.stats.dom);

    Scene.animate();

    // ajout on mouse hover
    window.addEventListener("mousemove", Scene.onMouseMove, false);
  },

  // chargement des objets
  loadFBX: (file, scale, position, rotation, color, namespace, callback) => {
    let loader = new FBXLoader();

    if (file === undefined) {
      return;
    }
    loader.load("./fbx/" + file, object => {
      let data = object;

      data.traverse(node => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;

          node.material.color = new THREE.Color(color);
        }
      });

      data.position.x = position[0];
      data.position.y = position[1];
      data.position.z = position[2];

      data.rotation.x = rotation[0];
      data.rotation.y = rotation[1];
      data.rotation.z = rotation[2];

      data.scale.x = data.scale.y = data.scale.z = scale;

      Scene.vars[namespace] = data;

      callback();
    });
  },

  // chargement du texte
  loadText: (text, scale, position, rotation, color, namespace, callback) => {
    let loader = new THREE.FontLoader();
    loader.load(
      "./vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json",
      font => {
        let geometry = new THREE.TextGeometry(text, {
          font: font,
          size: 1,
          height: 0.1,
          curveSegments: 1,
          bevelThickness: 1,
          bevelSize: 1,
          bevelEnabled: false
        });

        geometry.computeBoundingBox();
        let offset = geometry.boundingBox.getCenter().negate();
        geometry.translate(offset.x, offset.y, offset.z);

        let mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ color: new THREE.Color(color) })
        );
        mesh.position.x = position[0];
        mesh.position.y = position[1];
        mesh.position.z = position[2];

        mesh.rotation.x = rotation[0];
        mesh.rotation.y = rotation[1];
        mesh.rotation.z = rotation[2];

        mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

        Scene.vars[namespace] = mesh;

        callback();
      }
    );

    // let hash = document.location.hash.substr(1);
    // if (hash.length !== 0) {
    //   var texthash = hash.substring();
    //   Scene.vars.text = decodeURI(texthash);
    // } else {
    //   Scene.vars.text = "DAWIN";
    // }
  },

  // gestion redimensionnement
  onWindowResize: () => {
    let vars = Scene.vars;
    vars.camera.aspect = window.innerWidth / window.innerHeight;
    vars.camera.updateProjectionMatrix();
    vars.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  customAnimation: () => {
    let vars = Scene.vars;
    vars.animPurcent = vars.animPurcent + vars.animSpeed;
    if (vars.animPurcent > 1) {
      vars.animPurcent = 1;
    }
    if (vars.animPurcent < 0) {
      vars.animPurcent = 0;
    }
    if (vars.animPurcent <= 0.33) {
      vars.plaquette.position.z = 45 + 25 * 3 * vars.animPurcent;
      vars.texte.position.z = 46 + 25 * 3 * vars.animPurcent;
    }
    if (vars.animPurcent >= 0.2 && vars.animPurcent <= 0.75) {
      let purcent = (Scene.vars.animPurcent - 0.2) / 0.55;
      vars.socle1.position.x = 25 * purcent;
      vars.socle2.position.x = -25 * purcent;
      vars.logo.position.x = 45 + 50 * purcent;
      vars.logo2.position.x = -45 - 50 * purcent;
    } else if (vars.animPurcent < 0.2) {
      vars.socle1.position.x = 0;
      vars.socle2.position.x = 0;
      vars.logo.position.x = 45;
      vars.logo2.position.x = -45;
    }
    if (vars.animPurcent >= 0.4) {
      let purcent = (Scene.vars.animPurcent - 0.4) / 0.6;
      vars.statuette.position.y = 50 * purcent;
    } else if (vars.animPurcent < 0.7) {
      vars.statuette.position.y = 0;
    }
  },
  // lancement animation
  animate: () => {
    requestAnimationFrame(Scene.animate);
    Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

    if (Scene.vars.goldGroup != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.goldGroup.children,
        true
      );

      if (intersects.length > 0) {
        Scene.vars.animSpeed = 0.05;

        // Scene.vars.animPurcent = 0;
        // Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
        //Scene.vars.goldGroup.children[0].position.x = 25;
        // Scene.vars.goldGroup.children[0].position.x +=
        //   Scene.vars.animSpeed * 50;
        // Scene.vars.goldGroup.children[1].position.x = -25;
        // Scene.vars.goldGroup.children[2].position.y = 75;
        // Scene.vars.goldGroup.children[3].position.z = 100;
        // Scene.vars.goldGroup.children[4].position.x = 100;
        // Scene.vars.goldGroup.children[5].position.x = -100;
      } else {
        Scene.vars.animSpeed = -0.05;
        // Scene.vars.animPurcent = 0;
        // Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
        // Scene.vars.goldGroup.children[0].position.x +=
        //   Scene.vars.animSpeed * 50;
        // Scene.vars.goldGroup.children[1].position.x = 0;
        // Scene.vars.goldGroup.children[2].position.y = 0;
        // Scene.vars.goldGroup.children[3].position.z = 45;
        // Scene.vars.goldGroup.children[4].position.x = 45;
        // Scene.vars.goldGroup.children[5].position.x = -45;
      }

      let mouse = new THREE.Vector3(Scene.vars.mouse.x, Scene.vars.mouse.y, 0);
      mouse.unproject(Scene.vars.camera);
      let ray = new THREE.Raycaster(
        Scene.vars.camera.position,
        mouse.sub(Scene.vars.camera.position).normalize()
      );
      let helper = new THREE.ArrowHelper(ray, 5);
      Scene.vars.scene.add(helper);
    }
    // if (Scene.vars.silverGroupe != undefined) {
    //   var intersects = Scene.vars.raycaster.intersectObjects(
    //     Scene.vars.silverGroupe.children,
    //     true
    //   );

    //   //   for (var i = 0; i < intersects.length; i++) {
    //   //     intersects[i].object.material.color.set(0xff0000);
    //   //   }
    //   Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
    //   if (intersects.length > 0) {
    //     Scene.vars.animSpeed = 0.05;
    //     Scene.vars.silverGroupe.children[0].position.x = 25;
    //     Scene.vars.silverGroupe.children[1].position.x = -25;
    //     Scene.vars.silverGroupe.children[2].position.y = 75;
    //     Scene.vars.silverGroupe.children[3].position.z = 100;
    //     Scene.vars.silverGroupe.children[4].position.x = 100;
    //     Scene.vars.silverGroupe.children[5].position.x = -100;
    //   } else {
    //     Scene.vars.animSpeed = -0.05;
    //     Scene.vars.silverGroupe.children[0].position.x = 0;
    //     Scene.vars.silverGroupe.children[1].position.x = 0;
    //     Scene.vars.silverGroupe.children[2].position.y = 0;
    //     Scene.vars.silverGroupe.children[3].position.z = 45;
    //     Scene.vars.silverGroupe.children[4].position.x = 45;
    //     Scene.vars.silverGroupe.children[5].position.x = -45;
    //   }

    //   let mouse = new THREE.Vector3(Scene.vars.mouse.x, Scene.vars.mouse.y, 0);
    //   mouse.unproject(Scene.vars.camera);
    //   let ray = new THREE.Raycaster(
    //     Scene.vars.camera.position,
    //     mouse.sub(Scene.vars.camera.position).normalize()
    //   );
    //   let helper = new THREE.ArrowHelper(ray, 5);
    //   Scene.vars.scene.add(helper);
    // }
    // if (Scene.vars.bronzeGroupe != undefined) {
    //   var intersects = Scene.vars.raycaster.intersectObjects(
    //     Scene.vars.bronzeGroupe.children,
    //     true
    //   );

    //   //   for (var i = 0; i < intersects.length; i++) {
    //   //     intersects[i].object.material.color.set(0xff0000);
    //   //   }

    //   if (intersects.length > 0) {
    //     Scene.vars.animSpeed = 0.05;
    //     Scene.vars.bronzeGroupe.children[0].position.x = 25;
    //     Scene.vars.bronzeGroupe.children[1].position.x = -25;
    //     Scene.vars.bronzeGroupe.children[2].position.y = 75;
    //     Scene.vars.bronzeGroupe.children[3].position.z = 100;
    //     Scene.vars.bronzeGroupe.children[4].position.x = 100;
    //     Scene.vars.bronzeGroupe.children[5].position.x = -100;
    //   } else {
    //     Scene.vars.animSpeed = -0.05;
    //     Scene.vars.bronzeGroupe.children[0].position.x = 0;
    //     Scene.vars.bronzeGroupe.children[1].position.x = 0;
    //     Scene.vars.bronzeGroupe.children[2].position.y = 0;
    //     Scene.vars.bronzeGroupe.children[3].position.z = 45;
    //     Scene.vars.bronzeGroupe.children[4].position.x = 45;
    //     Scene.vars.bronzeGroupe.children[5].position.x = -45;
    //   }

    //   let mouse = new THREE.Vector3(Scene.vars.mouse.x, Scene.vars.mouse.y, 0);
    //   mouse.unproject(Scene.vars.camera);
    //   let ray = new THREE.Raycaster(
    //     Scene.vars.camera.position,
    //     mouse.sub(Scene.vars.camera.position).normalize()
    //   );
    //   let helper = new THREE.ArrowHelper(ray, 5);
    //   Scene.vars.scene.add(helper);
    // }

    Scene.render();
  },
  onMouseMove: event => {
    Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  },

  render: () => {
    Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
    Scene.vars.stats.update();
  }
};

Scene.init();
