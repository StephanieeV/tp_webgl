import * as THREE from "./vendor/three.js-master/build/three.module.js";
import { OrbitControls } from "./vendor/three.js-master/examples/jsm/controls/OrbitControls.js";
import Stats from "./vendor/three.js-master/examples/jsm/libs/stats.module.js";
import { FBXLoader } from "./vendor/three.js-master/examples/jsm/loaders/FBXLoader.js";
import { AudioLoader } from "./vendor/three.js-master/src/loaders/AudioLoader.js";

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

    // Preparation du container de la scene
    vars.container = document.createElement("div");
    vars.container.classList.add("fullscreen");
    document.body.appendChild(vars.container);

    // Creation d'une scene
    vars.scene = new THREE.Scene();
    vars.scene.background = new THREE.Color(0xa0a0a0);

    // Moteur de rendus
    vars.renderer = new THREE.WebGLRenderer({ antialias: true });
    vars.renderer.setPixelRatio(window.devicePixelRatio);
    vars.renderer.setSize(window.innerWidth, window.innerHeight);
    vars.renderer.shadowMap.enabled = true;
    vars.renderer.shadowMapSoft = true;
    vars.container.appendChild(vars.renderer.domElement);

    // Creation d'une camera
    vars.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    vars.camera.position.set(-1.5, 300, 572);

    // Creation d'une lumiere
    let light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    light.position.set(0, 700, 0);

    vars.scene.add(light);

    // Creation du sol et import de sa texture

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

    // Creation de la bulle
    let geometry = new THREE.SphereGeometry(1000, 32, 32);
    let material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xaaaaaa)
    });
    material.side = THREE.DoubleSide;
    let sphere = new THREE.Mesh(geometry, material);
    vars.scene.add(sphere);

    // Ajout audio
    var listener = new THREE.AudioListener();
    vars.camera.add(listener);
    var sound = new THREE.Audio(listener);
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load("./musique/Jingle-bells-Version2.mp3", function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    // Ajout de la lumiere directionnelle et son ombre
    let lightIntensity = 0.4;
    let directional1 = new THREE.DirectionalLight(0xffffff, lightIntensity);

    directional1.position.set(0, 700, 0);

    directional1.castShadow = true;
    let d = 1000;
    directional1.shadow.camera.left = -d;
    directional1.shadow.camera.right = d;
    directional1.shadow.camera.top = d;
    directional1.shadow.camera.bottom = -d;
    directional1.shadow.camera.far = 2000;
    directional1.shadow.mapSize.width = 4096;
    directional1.shadow.mapSize.height = 4096;

    

    vars.scene.add(directional1);

    
    

    document.querySelector("#loading").remove();
    Scene.loadFBX(
      "sapin.fbx",
      0.7,
      [0, 110, 0],
      [0, 0, 0],
      0x0c570a,
      "sapin",
      () => {
        Scene.loadFBX(
          "cadeaux.fbx",
          1.8,
          [0, 1000, 140],
          [0, 0, 0],
          0xaaaaaa,
          "cadeauxA",
          () => {
            Scene.loadFBX("cadeaux.fbx", 1.8, [1300, 0, 0], [0, 0, 0], 0xaaaaaa, "cadeauxB", () => {
              Scene.loadFBX("cadeaux.fbx", 1.8, [-1300, 0, 0], [0, 0, 0], 0xaaaaaa, "cadeauxC", () => {
                Scene.loadFBX(
                  "boule.fbx",
                  0.1,
                  [0, 215, 45],
                  [-Math.PI / 4, 0, 0],
                  0xffd700,
                  "bouleA",
                  () => {
                    Scene.loadFBX(
                      "boule.fbx",
                      0.1,
                      [45, 215, 0],
                      [0, 0, Math.PI / 4],
                      0xd1d1d1,
                      "bouleB",
                      () => {
                        Scene.loadFBX(
                          "boule.fbx",
                          0.1,
                          [-45, 215, 0],
                          [0, 0, -Math.PI / 4],
                          0xa3140f,
                          "bouleC",
                          () => {
                            Scene.loadFBX(
                              "boule.fbx",
                              0.1,
                              [0, 215, -45],
                              [Math.PI / 4, 0, 0],
                              0x1546a6,
                              "bouleD",
                              () => {
                                Scene.loadFBX("boule.fbx", 0.1, [0, 125, 65], [-Math.PI / 4, 0, 0], 0xa3140f, "bouleE", () => {
                                  Scene.loadFBX("boule.fbx", 0.1, [65, 125, 0], [0, 0, Math.PI / 4], 0x1546a6, "bouleF", () => {
                                    Scene.loadFBX("boule.fbx", 0.1, [-65, 125, 0], [0, 0, -Math.PI / 4], 0xffd700, "bouleG", () => {
                                      Scene.loadFBX("boule.fbx", 0.1, [0, 125, -65], [Math.PI / 4, 0, 0], 0xd1d1d1, "bouleH", () => {
                                        let sapin = new THREE.Group();
                                        sapin.add(Scene.vars.sapin);
                                        vars.scene.add(sapin);
                                        Scene.vars.sapin = sapin;

                                        let cadeaux_1 = new THREE.Group();
                                        cadeaux_1.add(Scene.vars.cadeauxA);
                                        vars.scene.add(cadeaux_1);
                                        Scene.vars.cadeaux_1 = cadeaux_1;

                                        let cadeaux_2 = new THREE.Group();
                                        cadeaux_2.add(Scene.vars.cadeauxB);
                                        cadeaux_2.position.z = -50;
                                        vars.scene.add(cadeaux_2);
                                        Scene.vars.cadeaux_2 = cadeaux_2;

                                        let cadeaux_3 = new THREE.Group();
                                        cadeaux_3.add(Scene.vars.cadeauxC);
                                        cadeaux_3.position.z = 50;
                                        vars.scene.add(cadeaux_3);
                                        Scene.vars.cadeaux_3 = cadeaux_3;

                                        let boule_1 = new THREE.Group();
                                        boule_1.add(Scene.vars.bouleA);
                                        boule_1.add(Scene.vars.bouleB);
                                        boule_1.add(Scene.vars.bouleC);
                                        boule_1.add(Scene.vars.bouleD);
                                        
                              
                                        vars.scene.add(boule_1);
                                        Scene.vars.boule_1 = boule_1;
                                        boule_1.children[0].traverse(node => {
                                        if (node.isMesh) {
                                          node.material = new THREE.MeshStandardMaterial({
                                            color: new THREE.Color(0xa3140f),
                                            roughness: 0.3,
                                            metalness: 0.6
                                          });

                                          node.material.color = new THREE.Color(0xa3140f);
                                          }
                                        });
                                        let boule_2 = boule_1.clone();
                                        boule_2.position.y = -45;
                                        vars.scene.add(boule_2);
                                        Scene.vars.boule_2 = boule_2;
                                        boule_2.children.traverse(node => {
                                          if (node.isMesh) {
                                            node.material = new THREE.MeshStandardMaterial({
                                              color: new THREE.Color(0x1546a6),
                                              roughness: 0.3,
                                              metalness: 0.6
                                            });

                                            node.material.color = new THREE.Color(0x1546a6);
                                          }
                                        });
                                        let boule_3 = new THREE.Group();
                                        boule_3.add(Scene.vars.bouleE);
                                        boule_3.add(Scene.vars.bouleF);
                                        boule_3.add(Scene.vars.bouleG);
                                        boule_3.add(Scene.vars.bouleH);
                                        vars.scene.add(boule_3);
                                        Scene.vars.boule_3 = boule_3;
                                        boule_3.children.traverse(node => {
                                          if (node.isMesh) {
                                            node.material = new THREE.MeshStandardMaterial({
                                              color: new THREE.Color(0xd1d1d1),
                                              roughness: 0.3,
                                              metalness: 0.6
                                            });

                                            node.material.color = new THREE.Color(0xd1d1d1);
                                          }
                                        });

                                        let boule_4 = boule_3.clone();
                                        boule_4.position.y = -45;
                                        vars.scene.add(boule_4);
                                        Scene.vars.boule_4 = boule_4;
                                        boule_4.children.traverse(node => {
                                          if (node.isMesh) {
                                            node.material = new THREE.MeshStandardMaterial({
                                              color: new THREE.Color(0xffd700),
                                              roughness: 0.3,
                                              metalness: 0.6
                                            });

                                            node.material.color = new THREE.Color(0xffd700);
                                          }
                                        });
                                        document.querySelector("#loading").remove();
                                      })
                                    })         
                                  })
                                })
                              })
                            })
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
   

    // Gestion du redimensionnement
    window.addEventListener("resize", Scene.onWindowResize, false);

    // Mise en place des controles
    vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
    vars.controls.minDistance = 500;
    vars.controls.maxDistance = 1000;
    vars.controls.minPolarAngle = Math.PI / 4;
    vars.controls.maxPolarAngle = Math.PI / 2;
    vars.controls.minAzimuthAngle = -Math.PI / 4;
    vars.controls.maxAzimuthAngle = Math.PI / 4;
    vars.controls.target.set(0, 100, 0);
    vars.controls.update();

    // Ajout des stats
    vars.stats = new Stats();
    vars.container.appendChild(vars.stats.dom);

    Scene.animate();

    // Ajout du on mouse hover
    window.addEventListener("mousemove", Scene.onMouseMove, false);
  },

  // Chargement des objets
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

  // Gestion du redimensionnement
  onWindowResize: () => {
    let vars = Scene.vars;
    vars.camera.aspect = window.innerWidth / window.innerHeight;
    vars.camera.updateProjectionMatrix();
    vars.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  // Gestion des animations
  customAnimation: () => {
    
    Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
    if (Scene.vars.animPurcent > 1) {
      Scene.vars.animPurcent = 1;
    }
    if (Scene.vars.animPurcent < 0) {
      Scene.vars.animPurcent = 0;
    }
    if (Scene.vars.animPurcent <= 0.33) {
      Scene.vars.cadeaux_1.position.y =-3300  * Scene.vars.animPurcent;
    }
    if (Scene.vars.animPurcent >= 0.2 && Scene.vars.animPurcent <= 0.75) {
      let purcent = (Scene.vars.animPurcent - 0.2) / 0.55;
      Scene.vars.cadeaux_2.position.x = -1280 * purcent;
    } else if (Scene.vars.animPurcent < 0.2) {
      Scene.vars.cadeaux_2.position.x = 0;
    }
    if (Scene.vars.animPurcent >= 0.4) {
      let purcent = (Scene.vars.animPurcent - 0.4) / 0.6;
      Scene.vars.cadeaux_3.position.x = 1100 * purcent;
    } else if (Scene.vars.animPurcent < 0.7) {
      Scene.vars.cadeaux_3.position.x = 0;
    }
  },
  // Lancement de l'animation
  animate: () => {
    requestAnimationFrame(Scene.animate);
    Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

    if (Scene.vars.boule_1 != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.boule_1.children,
        true
      );

      if (intersects.length > 0) {
        
        for (var i = 0; i < intersects.length; i++) {
          intersects[i].object.material.color.set(0x761990);
        }

      } 
      
    }
    if (Scene.vars.boule_2 != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.boule_2.children,
        true
      );

      if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {

          intersects[i].object.material.color.set(0xed9620);

        }
      } 

    }
    if (Scene.vars.boule_3 != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.boule_3.children,
        true
      );

      if (intersects.length > 0) {
        
        for (var i = 0; i < intersects.length; i++) {

          intersects[i].object.material.color.set(0x1c8e1d);

        }

      } 
    }
    
    if (Scene.vars.boule_4 != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.boule_4.children,
        true
      );

      if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {

          intersects[i].object.material.color.set(0x8e1c8e);

        }

      } 

    }
    if (Scene.vars.sapin != undefined) {
      Scene.customAnimation();

      var intersects = Scene.vars.raycaster.intersectObjects(
        Scene.vars.sapin.children,
        true
      );

      if (intersects.length > 0) {
        
        Scene.vars.animSpeed = 0.05;
        

      } else {

        Scene.vars.animSpeed = -0.05;
       
      }

    
    }

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
