const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(1, 1, 0), scene);
    camera.attachControl(canvas, true);
    camera.rotation.y = BABYLON.Tools.ToRadians(10);
    camera.rotation.x = BABYLON.Tools.ToRadians(20);
    camera.speed = 0.5;
    //camera.upperBetaLimit = Math.PI / 2.2;

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2, 1, 0), scene);
    light.intensity = 0.1;

    // Skybox not working
    // const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    // const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/skybox/", scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skybox.material = skyboxMaterial;

    //#region GUI
    const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.top = "-50px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    adt.addControl(panel);

    //Header
    const header = new  BABYLON.GUI.TextBlock();
    header.text = "Night to day";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header);

    //Slider
    const slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 1;
    slider.borderColor = "black";
    slider.color = "#AAAAAA"
    slider.background = "white";
    slider.value = 1;
    slider.height = "20px";
    slider.width = "200px";
    panel.addControl(slider);

    slider.onValueChangedObservable.add((value) => {
        if(light) {
            light.intensity = value;
        }
    });

    //#endregion
    //Trees
    const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "palmtree.png", 2000, {width: 512, height:1024}, scene);

    for(let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for(let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35 + 8;
        tree.position.y =  0.5;
    }

    //Fountain
    const fontainProfile = [
        new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(0.5, 0, 0),
        new BABYLON.Vector3(0.5, 0.2, 0),
		new BABYLON.Vector3(0.4, 0.2, 0),
        new BABYLON.Vector3(0.4, 0.05, 0),
        new BABYLON.Vector3(0.05, 0.1, 0),
		new BABYLON.Vector3(0.05, 0.8, 0),
		new BABYLON.Vector3(0.15, 0.9, 0)
    ]; 

    const fontain = BABYLON.MeshBuilder.CreateLathe("fontain",
    {shape: fontainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE, scene});
    fontain.position.x = -4;
    fontain.position.z = -6;

    //Particle system for fontain
    const particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

    particleSystem.particleTexture = new BABYLON.Texture("url", scene);

    particleSystem.emitter = new BABYLON.Vector3(-4, 0.8, -6);
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, -0.01);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.01, 0.01);
    particleSystem.color1 = new BABYLON.Color4(0, 0, 255, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0, 40, 255, 1.0);
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 1500;
    particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
    particleSystem.direction1 = new BABYLON.Vector3(1, 8, -1);
    particleSystem.minEmitPower = 0.2;
    particleSystem.minEmitPower = 0.6;
    particleSystem.updateSpeed = 0.01;
    particleSystem.gravity = new BABYLON.Vector3(0 -9.81, 0);
    //particleSystem.start();

    //Fountain on and off
    let switched = false; 

    scene.onPointerObservable.add((pointerInfo) => {
        switch(pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if(pointerInfo.pickInfo.hit) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh);
                }
            break;
        }
    });

    const pointerDown = (mesh) => {
        if(mesh === fontain) { //Picked mesh is the fontain
            switched = !switched; //Toggle switch (set it to the opposite)
            if(switched) {
                particleSystem.start();
            } else {
                particleSystem.stop();
            }
        }
    }

    //Import lamp-post
    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() =>{
        const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, scene);
        lampLight.diffuse = BABYLON.Color3.Yellow();
        lampLight.parent = scene.getMeshByName("bulb")
        lampLight.intensity = 0.5;

        const lamp = scene.getMeshByName("lamp");
        lamp.position = new BABYLON.Vector3(2, 0, 2); 
        lamp.rotation = BABYLON.Vector3.Zero();
        lamp.rotation.y = -Math.PI / 4;

        lamp3 = lamp.clone("lamp3");
        lamp3.position.z = -8;

        lamp1 = lamp.clone("lamp1");
        lamp1.position.x = -8;
        lamp1.position.z = 1.2;
        lamp1.rotation.y = Math.PI / 2;

        lamp2 = lamp1.clone("lamp2");
        lamp2.position.x = -2.7;
        lamp2.position.z = 0.8;
        lamp2.rotation.y = -Math.PI / 2;

    });


    const wireMat = new BABYLON.StandardMaterial("wireMat");
    wireMat.alpha = 0;

    const hitBox = BABYLON.MeshBuilder.CreateBox("carBox", { width: 0.5, height: 0.6, depth: 4.5 });
    hitBox.material = wireMat;
    hitBox.position.x = 3.1;
    hitBox.position.y = 0.3;
    hitBox.position.z = -5;

    let carReady = false;

    //Detailed village ground
    const villageGroundMat = new BABYLON.StandardMaterial("villageGroundMat");
    villageGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    villageGroundMat.diffuseTexture.hasAlpha = true;

    const villageGround = new BABYLON.MeshBuilder.CreateGround("villageGround", { width: 24, height: 24 });
    villageGround.material = villageGroundMat;

    //Large ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    groundMat.maxSimultaneousLights = 5;

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "villageheightmap.png"
        , { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 });
    largeGround.material = groundMat;
    largeGround.position.y = -0.01;

    //SOUND
    // const sound = new BABYLON.Sound("background_music", "emotional_background_music.wav",
    // scene, null, { loop:true, autoplay:true });

    //Creating car

    //#region CAR
    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.babylon")
        .then(() => {
            const wheelRB = scene.getMeshByName("wheelRB");
            const wheelRF = scene.getMeshByName("wheelRF");
            const wheelLB = scene.getMeshByName("wheelLB");
            const wheelLF = scene.getMeshByName("wheelLF");
            const car = scene.getMeshByName("car");
            carReady = true;
            car.position.y = 0.17;
            car.position.x = 3;
            car.position.z = 8;
            car.rotation.z = BABYLON.Tools.ToRadians(90);

            //Car animaton
            const animCar = new BABYLON.Animation("carAnimation", "position.z", 30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

            const carKeys = [];

            carKeys.push({
                frame: 0,
                value: 8
            });

            carKeys.push({
                frame: 150,
                value: -7
            });
            carKeys.push({
                frame: 200,
                value: -7
            });

            animCar.setKeys(carKeys);
            car.animations = [];
            car.animations.push(animCar);

            scene.beginAnimation(car, 0, 200, true);
            scene.beginAnimation(wheelRB, 0, 30, true);
            scene.beginAnimation(wheelRF, 0, 30, true);
            scene.beginAnimation(wheelLB, 0, 30, true);
            scene.beginAnimation(wheelLF, 0, 30, true);
        });
    //#endregion

    //#region CHARACTER

    const walk = function (turn, dist) {
        this.turn = turn;
        this.dist = dist;
    }

    const track = [];
    track.push(new walk(180, 2.5));
    track.push(new walk(0, 5));

    BABYLON.SceneLoader.ImportMeshAsync("him", "https://assets.babylonjs.com/meshes/Dude/", "dude.babylon", scene)
        .then((result) => {
            var dude = result.meshes[0];
            dude.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
            dude.position.y = 0.17;
            dude.position.x = 1.5;
            dude.position.z = -7;
            dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
            const startRotation = dude.rotationQuaternion.clone();
            const startPosition = dude.position.clone();

            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1);

            let distance = 0;
            let step = 0.015;
            let p = 0;

            scene.onBeforeRenderObservable.add(() => {
                //If car is deployed
                if (carReady) {
                    if (!dude.getChildren()[1].intersectsMesh(hitBox) && scene.getMeshByName("car").intersectsMesh(hitBox)) {
                        return;
                    }
                }
                dude.movePOV(0, 0, step);
                distance += step;

                if (distance > track[p].dist) {

                    //Turn so he face the right direction otherwise he will walk wrong direction
                    dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);

                    p += 1;
                    p %= track.length;

                    //reset 
                    if (p == 0) {
                        distance = 0;
                        dude.position = startPosition.clone();
                        dude.rotationQuaternion = startRotation.clone(); //set the rotation to the start rotation
                    }
                }
            });
        });
    //#endregion

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});