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

    //base
    const outline = [
        new BABYLON.Vector3(-0.3, 0, -0.1),
        new BABYLON.Vector3(0.2, 0, -0.1),
    ]

    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    const car = BABYLON.MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2 });
    car.position.y = 3;
    car.rotation.x = BABYLON.Tools.ToRadians(270);

    //Creating wheel

    const wheelLB = BABYLON.MeshBuilder.CreateCylinder("wheelLB", {diameter: 0.125, height: 0.05});
    wheelLB.parent = car;
    wheelLB.position.x = -0.2;
    wheelLB.position.y = -0.2;
    wheelLB.position.z = -0.1;

    const wheelLF = wheelLB.clone("wheelLF");
    wheelLF.position.x = 0.1;
    
    const wheelRB = wheelLB.clone("wheelRB");
    wheelRB.position.y = 0;
    
    const wheelRF = wheelLF.clone("wheelRF");
    wheelRF.position.y = 0;

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});