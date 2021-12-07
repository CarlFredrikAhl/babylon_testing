const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(1, 5, -3), scene);
    camera.attachControl(canvas, true);
    camera.rotation.y = BABYLON.Tools.ToRadians(10);
    camera.rotation.x = BABYLON.Tools.ToRadians(20);
    camera.speed = 0.5;

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(2, 1, 0), scene);

    const wireMat = new BABYLON.StandardMaterial("wireMat");
    wireMat.alpha = 0;

    const hitBox = BABYLON.MeshBuilder.CreateBox("carBox", {width: 0.5, height: 0.6, depth: 4.5});
    hitBox.material = wireMat; 
    hitBox.position.x = 3.1;
    hitBox.position.y = 0.3;
    hitBox.position.z = -5;

    let carReady = false;

    //Detailed village ground
    const villageGroundMat = new BABYLON.StandardMaterial("villageGroundMat");
    villageGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    villageGroundMat.diffuseTexture.hasAlpha = true;

    const villageGround = new BABYLON.MeshBuilder.CreateGround("villageGround", {width: 24, height: 24});
    villageGround.material = villageGroundMat;

    //Large ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "villageheightmap.png"
    , {width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10});
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

    const walk = function(turn, dist){
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

            if(distance > track[p].dist) {
                
                //Turn so he face the right direction otherwise he will walk wrong direction
                dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);

                p += 1;
                p %= track.length;
                
                //reset 
                if(p == 0) {
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