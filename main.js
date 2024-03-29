

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

function createScene() {
    
    const scene = new BABYLON.Scene(engine);
    
    
    const cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(60, 50, 90), scene);
    cam.attachControl(canvas, true);
    cam.rotation = new BABYLON.Vector3(0.2, 10, 0);
    
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    // const environment = scene.createDefaultEnvironment({createGround: false, skyboxSize:1000});
    // environment.setMainColor(BABYLON.Color3.Red);
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height:500}, scene);
    
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3.Gray;
    
    //Enable physics
    var gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.enablePhysics(gravity, new BABYLON.OimoJSPlugin());

    ground.material = groundMat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction:0.8, 
    restitution: 0.5, disableBidirectionalTransformation: true}, scene);
    ground.checkCollisions = true;

    var yPos = 2;

    var cubes = [];

    //Cube tower
    for(var i = 0; i < 10; i++) {

        const cube = BABYLON.MeshBuilder.CreateBox("box" + i, {width: 5, height: 5, depth: 5}, scene);
        cube.position.y = yPos;
        //cube.position.x = Math.floor(Math.random() * 10);
         
        const randomNr = Math.floor(Math.random() * 6);
        
        const cubeMat = new BABYLON.StandardMaterial("cubeMat");

        switch(randomNr) {
            case 0:
                cubeMat.diffuseColor = new BABYLON.Color3.Blue;
            break;
            case 1: 
                cubeMat.diffuseColor = new BABYLON.Color3.Yellow;
            break;
            case 2: 
                cubeMat.diffuseColor = new BABYLON.Color3.Red;
            break;
            case 3:
                cubeMat.diffuseColor = new BABYLON.Color3.Purple;
            break;
            case 4:
                cubeMat.diffuseColor = new BABYLON.Color3.Green;
            break;
            case 5:
                cubeMat.diffuseColor = new BABYLON.Color3.Magenta;
            break;
        }

        cube.material = cubeMat;
        cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, friction: 1
        , restitution: 0}, scene);

        cubes.push(cube);

        //Position next cube on top of other
        yPos += 5;
    }

    //Add force when clicking cube
    scene.onPointerObservable.add((pointerInfo) => {
        switch(pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                pointerInfo.pickInfo.pickedMesh.applyImpulse(new BABYLON.Vector3(0, 0, -60), 
                pointerInfo.pickInfo.pickedMesh.getAbsolutePosition());
        }
    }); 

    // cubes.forEach(cube => {
    //     //Force settings
    //     var randX = Math.floor(Math.random() * 50);
    //     var randY = Math.floor(Math.random() * 50);
    //     var randZ = Math.floor(Math.random() * 50);

    //     var impulseDirection = new BABYLON.Vector3(randX, randY, randZ);
        
    //     cube.applyImpulse(impulseDirection, cube.getAbsolutePosition());
    // });

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
    
    let divFps = document.getElementById("fps");
    divFps.innerHTML = engine.getFps().toFixed() + " fps";
});