// GLOBAL VARIABLES


var camera, scene, renderer;
var geometry, material, mesh, cameraControl;
var particleSystem,particleCount,particles, particle;
var clock = new THREE.Clock(),options, spawnerOptions, particleSystem,
container, tick = 0;

var stats;
var spawnerOptionsArray = []; 



init();
animate();

function init() {

    // Create Camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );
    camera.position.z = 50;

    // Create scene Along with Cube
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );


    // Controls
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    // Stats such as FPS
    stats = new Stats();
    container = document.getElementById( 'container' );
    container.appendChild( stats.dom );

    particleInit();

}

// While loop
function animate() {
    requestAnimationFrame( animate );

    // particleSystem.rotation.y += 0.01;
    // particleSystem.rotation.x += 0.01;



    controls.update();
    particlePhysics();
    render();
    stats.update();
}

// Render function
function render() {
    renderer.render( scene, camera );
}

// Dynamic Window Resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
}

// Create Particles Here
function particleInit()
{
    particleSystem = new THREE.GPUParticleSystem( {
        maxParticles: 1000
    } ); 
    scene.add( particleSystem );

    options = {
        position: new THREE.Vector3(),
        positionRandomness: 0.3,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.0,
        color: 0xe25822,
        colorRandomness: 0.2,
        turbulence: 0.05,
        lifetime: 2,
        size: 20,
        sizeRandomness: 1
    };
    
    for (var x = 0; x < 100; x++)
    {
        spawnerOptions = {
            spawnRate: 1,
            horizontalSpeed: 1,
            verticalSpeed: 1,
            zSpeed: 1,
            timeScale: 1,
            gravitySpeed: 0
        };
        spawnerOptions.horizontalSpeed = ((Math.random() * spawnerOptions.horizontalSpeed) - (spawnerOptions.horizontalSpeed/2)) * 50;
    
        spawnerOptions.verticalSpeed = ((Math.random() * spawnerOptions.verticalSpeed) - (spawnerOptions.verticalSpeed/2)) * 50;

        spawnerOptions.zSpeed = ((Math.random() * spawnerOptions.zSpeed) - (spawnerOptions.zSpeed/2)) * 50;
        spawnerOptions.gravitySpeed = spawnerOptions.verticalSpeed;

        spawnerOptionsArray.push(spawnerOptions);
        // console.log(spawnerOptionsArray);
    }
    // spawnerOptions = {
    //     spawnRate: 1,
    //     horizontalSpeed: 1,
    //     verticalSpeed: 1,
    //     timeScale: 1
    // };
    // spawnerOptions.horizontalSpeed = ((Math.random() * spawnerOptions.horizontalSpeed) - (spawnerOptions.horizontalSpeed/2)) * 50;

    // spawnerOptions.verticalSpeed = ((Math.random() * spawnerOptions.verticalSpeed) - (spawnerOptions.verticalSpeed/2)) * 50;
    // console.log(spawnerOptions.horizontalSpeed);

}

// Particles Physics
function particlePhysics()
{
    var delta = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta;
    options.velocity.x = 0;
    options.velocity.y = 0;
    options.velocity.y = 0;

    // spawnerOptions.horizontalSpeed = (Math.random() * spawnerOptions.horizontalSpeed);

    // console.log(spawnerOptions.horizontalSpeed);
    // console.log(Math.random() * spawnerOptions.horizontalSpeed);
    

    for (var x = 0; x < spawnerOptionsArray.length; x++)
    {
            // console.log("hello");

        if ( tick < 0 ) tick = 0;
        if ( delta > 0 ) {
            if (options.position.y < -50 || options.position.x < -50)
            {
                // console.log(posx);
                // options.lifetime = 0;

                tick = 0;
                for (let x = 0; x < spawnerOptionsArray.length; x++)
                {
                // spawnerOptionsArray[x].verticalSpeed = 0;
                // spawnerOptionsArray[x].horizontalSpeed = 0;
                // spawnerOptionsArray[x].zSpeed = 0;
                // spawnerOptionsArray[x].verticalSpeed = 0;
                spawnerOptionsArray[x].gravitySpeed = spawnerOptionsArray[x].verticalSpeed;
                }


            }
            spawnerOptionsArray[x].gravitySpeed -= 0.1;
            // console.log(spawnerOptionsArray[x].gravitySpeed);

            options.position.y = spawnerOptionsArray[x].gravitySpeed * tick;
            options.position.x = spawnerOptionsArray[x].horizontalSpeed * tick;
            options.position.z = spawnerOptionsArray[x].zSpeed * tick;
            // options.size += .001

            // console.log(options.position.x);

            // options.position.y = (Math.random() * options.velocity.y * 80) - (options.velocity.y/2);

            // options.position.x = (Math.random() * options.velocity.x * 80) - (options.velocity.x/2);
            particleSystem.spawnParticle( options );


            for ( let x = 0; x < spawnerOptionsArray[x].spawnRate * delta; x ++ ) {
                // particleSystem.spawnParticle( options );


                // options.position.x *= -1;
                // particleSystem.spawnParticle( spawnerOptionsArray[x] );
                // particleSystem.spawnParticle(spawnerOptionsArray[x]);



            }
    }   
    
    }
    particleSystem.update( tick );
}

function fireworksInit() {




}