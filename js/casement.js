        function createProfile(geometryName, bCx, tCx, tCy, profile) {
            switch (profile) {
                case 'frameProfile':
                    let radius = 12;
                    geometryName.lineTo(bCx, tCy-radius-2);
                    geometryName.lineTo(bCx+2, tCy-radius-2);
                    geometryName.absarc(bCx+2+radius, tCy-radius-2, radius, Math.PI, Math.PI/2, true);
                    geometryName.lineTo(bCx+2+radius, tCy);
                    break;
                default:
                    geometryName.lineTo(bCx, tCy);
                    geometryName.lineTo(tCx, tCy);
                    break;
            }
        }
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xdddddd );
        document.body.appendChild( renderer.domElement );

        //const loader = new THREE.TextureLoader();
        const materialSapele = new THREE.MeshPhongMaterial({color: '#421a0c', wireframe: false,
        //map: loader.load('textures/sapele.jpeg'),
        });
        const materialAccoya = new THREE.MeshPhongMaterial({color: '#fabb64', wireframe: false,});

        const materialAccoya2 = new THREE.MeshPhongMaterial({color: '#fff', shininess: 70,});

        // Cill generation Start

        const materialGlass = new THREE.MeshPhongMaterial({
            transparent: true,
            shininess: 100,
            opacity: 0.2,
            color: 0xcae8de,
          });

        let xo = 0; // x offset
        let yo = 0; // y offset

        //some starting values for creation of cill cross-section
        let cill = {
            height: 65,
            width: 600,
            depth: 95,
            casementDepth: 45,
            rebate: 12,
            cillSlopeTan: 0.14054 //tangent of 8 degrees
        }

        let cillShape = new THREE.Shape();
        cillShape.moveTo(xo, yo);
        
        createProfile(cillShape, xo, (cill.depth - (cill.casementDepth+5)), cill.height, "frameProfile");
            //cillShape.lineTo(xo, cill.height);
        cillShape.lineTo((cill.depth - (cill.casementDepth+5)), cill.height);
        cillShape.lineTo((cill.depth - (cill.casementDepth+5)), (cill.height - cill.rebate));
        cillShape.lineTo(cill.depth, (cill.height - (cill.rebate + (cill.cillSlopeTan * (cill.casementDepth+5)))));
        cillShape.lineTo(cill.depth, yo);
        cillShape.lineTo(xo, yo);

        let geometry = new THREE.ExtrudeGeometry(cillShape, {
            depth: cill.width,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });
        
        //geometry.center();
        
        let cillMesh = new THREE.Mesh( geometry, materialSapele );
        cillMesh.translateZ(-cill.width/2);
        //scene.add( cillMesh );

        // Cill Generation End

        // Left Jamb Generation

        let jambL = {
            //first we construct jambL on x,y plane then rotate it for correct positioning
            height: 800, // world z
            width: 57, // world y
            depth: 95, // world x
            rebate: 12,
            casement: 45,
            seal: 5,
        }

        let jambLX = 0;
        let jambLY = 0; 
        let jambLZ = cill.width/2;

        let leftJamb = new THREE.Shape();
        leftJamb.moveTo(jambLX, jambLY);
        createProfile(leftJamb, jambLX, (jambL.depth - (jambL.casement+5)), jambL.width, "frameProfile");
        //leftJamb.lineTo(jambLX, jambL.width);
        leftJamb.lineTo(jambL.depth-(jambL.seal+jambL.casement), jambL.width);
        leftJamb.lineTo(jambL.depth-(jambL.seal+jambL.casement), jambL.width-jambL.rebate);
        leftJamb.lineTo(jambL.depth, jambL.width-jambL.rebate);
        leftJamb.lineTo(jambL.depth, jambLY);
        leftJamb.lineTo(jambLX, jambLY);

        let geometry2 = new THREE.ExtrudeGeometry(leftJamb, {
            depth: jambL.height,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        geometry2.rotateX(-Math.PI/2);

        let leftJambMesh = new THREE.Mesh( geometry2, materialAccoya );
        leftJambMesh.translateZ(jambLZ);

        scene.add( leftJambMesh );

        // End of Left Jamb

        // Right Jamb Generation

        let jambR = {
            //first we construct jambL on x,y plane then rotate it for correct positioning
            height: 800, // world z
            width: 57, // world y
            depth: 95, // world x
            rebate: 12,
            casement: 45,
            seal: 5,
        }

        let jambRX = 0;
        let jambRY = 0; 
        let jambRZ = cill.width/2;

        let rightJamb = new THREE.Shape();
        rightJamb.moveTo(jambRX, jambRY);
        createProfile(rightJamb, jambRX, (jambR.depth - (jambR.casement+5)), jambR.width, "frameProfile");
        //rightJamb.lineTo(jambRX, jambR.width);
        rightJamb.lineTo(jambR.depth-(jambR.seal+jambR.casement), jambR.width);
        rightJamb.lineTo(jambR.depth-(jambR.seal+jambR.casement), jambR.width-jambR.rebate);
        rightJamb.lineTo(jambR.depth, jambR.width-jambR.rebate);
        rightJamb.lineTo(jambR.depth, jambRY);
        rightJamb.lineTo(jambRX, jambRY);

        let geometry3 = new THREE.ExtrudeGeometry(rightJamb, {
            depth: jambR.height,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        geometry3.rotateX(Math.PI/2);

        let rightJambMesh = new THREE.Mesh( geometry3, materialAccoya );

        rightJambMesh.translateZ(-jambRZ);
        rightJambMesh.translateY(jambR.height);

        scene.add( rightJambMesh );

        // End of Right Jamb generation

        // Start of Head Generation

        let head = {
            height: 57, // world y
            width: cill.width, // world z
            depth: 95, // world x
            rebate: 12,
            casement: 45,
            seal: 5,
        }

        let headX = 0;
        let headY = 0; 
        let headZ = cill.width/2;

        let headShape = new THREE.Shape();
        headShape.moveTo(headX, headY);
        //createProfile(headShape, headX, (head.depth - (head.casement+5)), head.hight, "frameProfile");
        headShape.lineTo(headX, -head.height);
        headShape.lineTo((head.depth-(head.casement+head.seal)), -head.height);
        headShape.lineTo((head.depth-(head.casement+head.seal)), (-head.height+head.rebate));
        headShape.lineTo(head.depth, (-head.height+head.rebate));
        headShape.lineTo(head.depth, headY);
        headShape.lineTo(headX, headY);

        let geometry4 = new THREE.ExtrudeGeometry(headShape, {
            depth: head.width,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        //geometry4.rotateX(Math.PI/2);

        let headMesh = new THREE.Mesh( geometry4, materialAccoya );

        headMesh.translateZ(-jambRZ);
        headMesh.translateY(jambR.height);

        //scene.add( headMesh );

        // End of Head Generation

        //CASEMENT START HERE

        /* Casement Top Rail */
        const casWidth = cill.width-(2*(jambR.width-jambR.rebate)+6)

        let casTopRail = {
            
            height: 57, // world y
            width: casWidth, // world z
            depth: 45, // world x
            rebate: 9,
        }

        let ctrX = head.depth-(casTopRail.depth);
        let ctrY = jambR.height-(head.height-head.rebate)-3; 
        let ctrZ = casWidth/2;

        let topRailShape = new THREE.Shape();
        topRailShape.moveTo(ctrX, ctrY);
        topRailShape.lineTo(ctrX, ctrY-casTopRail.height);
        topRailShape.lineTo(ctrX+13, ctrY-casTopRail.height);
        topRailShape.lineTo(ctrX+13, (ctrY-casTopRail.height)+casTopRail.rebate);
        topRailShape.lineTo(ctrX+casTopRail.depth, (ctrY-casTopRail.height)+casTopRail.rebate);
        topRailShape.lineTo(ctrX+casTopRail.depth, ctrY);
        topRailShape.lineTo(ctrX, ctrY);

        let geometry5 = new THREE.ExtrudeGeometry(topRailShape, {
            depth: casWidth,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        let casementTopRailMesh = new THREE.Mesh( geometry5, materialAccoya2 );
        casementTopRailMesh.translateZ(-ctrZ);

        //Casement Top Rail End
        
        let cillFace = cill.height - (cill.rebate + (cill.cillSlopeTan * (cill.casementDepth+5)));
        
        /* Casement Bottom Rail */
        
        let casBtmRail = {
            
            height: 75, // world y
            width: casWidth, // world z
            depth: 45, // world x
            rebate: 9,
        }

        let cbrX = head.depth-casBtmRail.depth;
        let cbrY = cill.height-cill.rebate+3; 
        let cbrZ = casWidth/2;

        let bottomRailShape = new THREE.Shape();
        bottomRailShape.moveTo(cbrX, cbrY);
        bottomRailShape.lineTo(cbrX+casBtmRail.depth, cillFace+3);
        bottomRailShape.lineTo(cbrX+casBtmRail.depth, (cillFace+3+casBtmRail.height)-casBtmRail.rebate);
        bottomRailShape.lineTo(cbrX+13, (cillFace+3+casBtmRail.height)-casBtmRail.rebate);
        bottomRailShape.lineTo(cbrX+13, cillFace+3+casBtmRail.height);
        bottomRailShape.lineTo(cbrX, cillFace+3+casBtmRail.height);
        bottomRailShape.lineTo(cbrX, cbrY);

        let geometry6 = new THREE.ExtrudeGeometry(bottomRailShape, {
            depth: casWidth,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        let casementBottomRailMesh = new THREE.Mesh( geometry6, materialAccoya2 );
        casementBottomRailMesh.translateZ(-cbrZ);

        //Casement Top Rail End

        //Casement Stile Left Start

        let casHeight = jambL.height-6-(head.height-head.rebate)-(cill.height-cill.rebate);

        let stileLeft = {
            height: casHeight,
            width: 57,
            depth: 45,
            rebate: 9,
        }

        let slX = 0; //cbrX;
        let slY = 0; //cbrY;
        let slZ = 0;

        let stileLeftShape = new THREE.Shape();
        stileLeftShape.moveTo(slX, slY);
        stileLeftShape.lineTo(slX, slY+stileLeft.width);
        stileLeftShape.lineTo(slX+13, slY+stileLeft.width);
        stileLeftShape.lineTo(slX+13, slY+stileLeft.width-stileLeft.rebate);
        stileLeftShape.lineTo(slX+stileLeft.depth, slY+stileLeft.width-stileLeft.rebate);
        stileLeftShape.lineTo(slX+stileLeft.depth, slY);
        stileLeftShape.lineTo(slX, slY);

        let geometry7 = new THREE.ExtrudeGeometry(stileLeftShape, {
            depth: casHeight,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        geometry7.rotateX(-Math.PI/2);
        
        let casementStileLeftMesh = new THREE.Mesh( geometry7, materialAccoya2 );
        
        casementStileLeftMesh.translateY(cbrY);
        casementStileLeftMesh.translateX(cbrX);
        casementStileLeftMesh.translateZ(casWidth/2);

        //Casement Stile Left End


        //Casement Stile Right Start

        let stileRight = {
            height: casHeight,
            width: 57,
            depth: 45,
            rebate: 9,
        }

        let srX = 0; //cbrX;
        let srY = 0; //cbrY;
        let srZ = 0;

        let stileRightShape = new THREE.Shape();
        stileRightShape.moveTo(slX, slY);
        stileRightShape.lineTo(slX, slY+stileRight.width);
        stileRightShape.lineTo(slX+13, slY+stileRight.width);
        stileRightShape.lineTo(slX+13, slY+stileRight.width-stileRight.rebate);
        stileRightShape.lineTo(slX+stileRight.depth, slY+stileRight.width-stileRight.rebate);
        stileRightShape.lineTo(slX+stileRight.depth, slY);
        stileRightShape.lineTo(slX, slY);

        let geometry8 = new THREE.ExtrudeGeometry(stileRightShape, {
            depth: casHeight,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        geometry8.rotateX(Math.PI/2);
        
        let casementStileRightMesh = new THREE.Mesh(geometry8, materialAccoya2);
        
        casementStileRightMesh.translateY(cbrY+casHeight);
        casementStileRightMesh.translateX(cbrX);
        casementStileRightMesh.translateZ(-casWidth/2);

        //Casement Stile Left End

        /* Glass creation */

        let glass = {
            width: casWidth-4-(2*(stileRight.width-stileRight.rebate)),
            height: casHeight-4-((casTopRail.height-casTopRail.rebate)+(casBtmRail.height-casBtmRail.rebate)),
            depth: 14,
        }

        let glassPaneShape = new THREE.Shape();
        glassPaneShape.moveTo(0, 0);
        glassPaneShape.lineTo(0, glass.height);
        glassPaneShape.lineTo(glass.width, glass.height);
        glassPaneShape.lineTo(glass.width, 0);
        glassPaneShape.lineTo(0, 0);

        let geometry9 = new THREE.ExtrudeGeometry(glassPaneShape, {
            depth: glass.depth,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        geometry9.rotateY(Math.PI/2);
        
        let glassMesh = new THREE.Mesh(geometry9, materialGlass);
        
        glassMesh.translateY(2+((cill.height-cill.rebate)+(casBtmRail.height-casBtmRail.rebate)));
        glassMesh.translateX(head.depth-(casTopRail.depth)+13);
        glassMesh.translateZ(glass.width/2);

        /* Glass creation */

        //Frame Group Set Up

        const frame = new THREE.Group();
        frame.add(cillMesh);
        frame.add(leftJambMesh);
        frame.add(rightJambMesh);
        frame.add(headMesh);

        //casement group
        const singleCasement = new THREE.Group();
        singleCasement.add(casementTopRailMesh);
        singleCasement.add(casementBottomRailMesh);
        singleCasement.add(casementStileLeftMesh);
        singleCasement.add(casementStileRightMesh);
        singleCasement.add(glassMesh);

        
        scene.add(frame);
        scene.add(singleCasement);

        // Light Set Up

        const lightColor = 0xffffff ;
        const ambIntensity = 0.4;
        const amblight = new THREE.AmbientLight(lightColor, ambIntensity);
        scene.add(amblight);

        const intensity = 0.7;
        const light = new THREE.DirectionalLight(lightColor, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

        // Light Set Up Finish

        const axesHelper = new THREE.AxesHelper( 200 );
        scene.add( axesHelper );

        const controls = new THREE.OrbitControls( camera, renderer.domElement );

        //controls.update() must be called after any manual changes to the camera's transform

        camera.position.z = 400;
        camera.position.y = 1000;
        camera.position.x = 500;
        controls.update();

        const animate = function () {
            requestAnimationFrame( animate );

            //frame.rotation.x += 0.01;
            frame.rotation.y += 0.001;
            singleCasement.rotation.y += 0.001;

            renderer.render( scene, camera );
        };

        animate();
