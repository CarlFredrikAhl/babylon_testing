

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);


    const cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(25, 20, 35), scene);
    cam.attachControl(canvas, true);
    cam.rotation = new BABYLON.Vector3(0, 10, 0);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // const environment = scene.createDefaultEnvironment({createGround: false, skyboxSize:1000});
    // environment.setMainColor(BABYLON.Color3.Red);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height:500}, scene);
    
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3.Gray;

    ground.material = groundMat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction:0.8, 
    restitution: 0.5, disableBidirectionalTransformation: true}, scene);
    ground.checkCollisions = true;

    //Cube tower
    for(var i = 0; i < 10; i++) {

        const cube = BABYLON.MeshBuilder.CreateBox("box" + i, {width: 5, height: 5, depth: 5}, scene);
        cube.position.y = 2;
         
        const cubeMat = new BABYLON.StandardMaterial("cubeMat");
        cubeMat.diffuseColor = new BABYLON.Color3.Blue;
        cube.material = cubeMat;
    }

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});