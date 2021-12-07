const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(1, 5, -3), scene);
    camera.attachControl(canvas, true);
    camera.rotation.y = BABYLON.Tools.ToRadians(10);
    camera.rotation.x = BABYLON.Tools.ToRadians(20);
    camera.speed = 0.5;

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    //Load village
    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");

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
        car.position.y = 0.17;
        
        //Car animaton
        const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const carKeys = [];

        carKeys.push({
            frame: 0,
            value: 0 
        });
        
        carKeys.push({
            frame: 150,
            value: 5
        });

        animCar.setKeys(carKeys);
        car.animations = [];
        car.animations.push(animCar);
        
        scene.beginAnimation(car, 0, 150, true);
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
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))

    BABYLON.SceneLoader.ImportMeshAsync("him", "https://assets.babylonjs.com/meshes/Dude/", "dude.babylon", scene)
    .then((result) => {
        var dude = result.meshes[0];
        dude.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
        dude.position.y = 0.17;
        dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
        const startRotation = dude.rotationQuaternion.clone();

        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1);

        let distance = 0;
        let step = 0.005;
        let p = 0;

        scene.onBeforeRenderObservable.add(() => {
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
                    dude.position = new BABYLON.Vector3(-6, 0, 0);
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