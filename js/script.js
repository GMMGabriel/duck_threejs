// <VARIÁVEIS DE REFERÊNCIA> ================================================================
const div_actions_width = document.querySelector('.actions').clientWidth;
// Variável que guardará o índice da animação, para parar quando clicar no botão
let ref = 0;
// Valor padrão da rotação da asa esquerda
const rotation_left_wing = 0.5
// Valor padrão da rotação da asa direita
const rotation_right_wing = rotation_left_wing * -1
// Valor padrão da rotação da parte de baixo do bico
const rotation_duckbill_down = 0.3
// </VARIÁVEIS DE REFERÊNCIA> ================================================================

// Our Javascript will go here.
const scene = new THREE.Scene();

// Grupo do corpo todo
const pivot_all = new THREE.Group();

// Grupo da cabeça
const pivot_head = new THREE.Group();
pivot_head.position.set(0, 1.75, 0.5);
// Grupo para o bico
const pivot_duckbill = new THREE.Group();
pivot_duckbill.position.set(0, -0.3, 1.2);

// Grupo para o "tronco" e pernas
const pivot_body = new THREE.Group();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - div_actions_width, window.innerHeight - (div_actions_width / 2));
document.body.appendChild(renderer.domElement);

// CABEÇA
const geometry_head = new THREE.CapsuleGeometry(1, 0, 100, 100);
geometry_head.translate(0, 0, 0,);
// const material_head = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const material_head = new THREE.MeshBasicMaterial({ color: 0xEFEFEF });
const head = new THREE.Mesh(geometry_head, material_head);
pivot_head.add(head);

// OLHO ESQUERDO
const material_eye = new THREE.MeshBasicMaterial({ color: 0x000000 });

const geometry_left_eye = new THREE.SphereGeometry(0.15, 64, 32);
const left_eye = new THREE.Mesh(geometry_left_eye, material_eye);
left_eye.position.set(-.60, .2, .70);
pivot_head.add(left_eye);
// OLHO DIREITO
const geometry_right_eye = new THREE.SphereGeometry(0.15, 64, 32);
const right_eye = new THREE.Mesh(geometry_right_eye, material_eye);
right_eye.position.set(.60, .2, .70);
pivot_head.add(right_eye);

// BICO DE PATO
const material_duckbill = new THREE.MeshBasicMaterial({ color: 0xFF7F00 }); // cor padrão
// PARTE DE CIMA DO BICO
const geometry_duckbill_up = new THREE.BoxGeometry(0.8, 0.1, 0.8);
const duckbill_up = new THREE.Mesh(geometry_duckbill_up, material_duckbill);
duckbill_up.rotation.x = 0.3;
pivot_duckbill.add(duckbill_up);
// PARTE DE BAIXO DO BICO
const geometry_duckbill_down = new THREE.BoxGeometry(0.8, 0.1, 0.8);
geometry_duckbill_down.translate(0.0, 0.0, 0.4);
const duckbill_down = new THREE.Mesh(geometry_duckbill_down, material_duckbill);
duckbill_down.rotation.x = 0.3;
duckbill_down.position.set(0, 0.1, -0.4);
pivot_duckbill.add(duckbill_down);

// CORPO
const geometry_body = new THREE.CapsuleGeometry(1.2, 1.5, 100, 100);
// const material_body = new THREE.MeshBasicMaterial({ color: 0x114433 });
const material_body = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const body = new THREE.Mesh(geometry_body, material_body);
body.rotation.x = 4.715;
pivot_body.add(body);

// ASA ESQUERDA
const geometry_left_wing = new THREE.BoxGeometry(0.1, 0.8, 1.2);
geometry_left_wing.translate(0, 0, -0.5);
const material_left_wing = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const left_wing = new THREE.Mesh(geometry_left_wing, material_left_wing);
left_wing.position.set(-1.2, 0, 0.5);
left_wing.rotation.y = 0.5;
pivot_body.add(left_wing);

// ASA DIREITA
const geometry_right_wing = new THREE.BoxGeometry(0.1, 0.8, 1.2);
geometry_right_wing.translate(0, 0, -0.5);
const material_right_wing = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const right_wing = new THREE.Mesh(geometry_right_wing, material_right_wing);
right_wing.position.set(1.2, 0, 0.5);
right_wing.rotation.y = -left_wing.rotation.y;
pivot_body.add(right_wing);

// PERNA ESQUERDA
const geometry_left_leg = new THREE.ConeGeometry(0.5, 1.2, 64);
const material_left_leg = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const left_leg = new THREE.Mesh(geometry_left_leg, material_left_leg);
left_leg.position.set(-1, -1, 0)
pivot_body.add(left_leg);

// PERNA DIREITA
const geometry_right_leg = new THREE.ConeGeometry(0.5, 1.2, 64);
const material_right_leg = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const right_leg = new THREE.Mesh(geometry_right_leg, material_right_leg);
right_leg.position.set(1, -1, 0)
pivot_body.add(right_leg);

// OBJETO PARA USAR COMO REFERÊNCIA PARA AS PERNAS.
const legs_ref_geometry = new THREE.CircleGeometry();
const material_legs_ref_geometry = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const mesh_legs_ref_geometry = new THREE.Mesh(legs_ref_geometry, material_legs_ref_geometry);

// OBJETO PARA USAR COMO REFERÊNCIA PARA AS ASAS.
const wings_ref_geometry = new THREE.CircleGeometry();
const material_wings_ref_geometry = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const mesh_wings_ref_geometry = new THREE.Mesh(wings_ref_geometry, material_wings_ref_geometry);

// OBJETO PARA USAR COMO REFERÊNCIA PARA O BICO.
const duckbill_ref_geometry = new THREE.CircleGeometry();
const material_duckbill_ref_geometry = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
const mesh_duckbill_ref_geometry = new THREE.Mesh(duckbill_ref_geometry, material_duckbill_ref_geometry);

function duckAnimation() {
  ref = requestAnimationFrame(duckAnimation);

  // pivot_all.rotation.x += 0.01;
  // pivot_all.rotation.y += 0.01;

  // HÉLICE DE ASA!
  // left_wing.rotation.y += 0.01;
  // right_wing.rotation.y = left_wing.rotation.y * -1;

  // Função para movimentar o personagem
  const move = () => {
    let flag_legs;
    if (mesh_legs_ref_geometry.rotation.x === 0) {
      flag_legs = true;
    } else {
      flag_legs = false;
    }

    let flag_wings;
    if (mesh_wings_ref_geometry.rotation.x === 0) {
      flag_wings = true;
    } else {
      flag_wings = false;
    }

    let flag_duckbill;
    if (mesh_duckbill_ref_geometry.rotation.x === 0) {
      flag_duckbill = true;
    } else {
      flag_duckbill = false;
    }

    // // Movimenta a cabeça
    // if (flag_legs) {
    //   pivot_head.rotation.y -= 0.025;
    // } else {
    //   pivot_head.rotation.y += 0.025;
    // }

    // Movimenta o bico
    if (flag_duckbill) {
      if (duckbill_down.rotation.x < 0.6) {
        duckbill_down.rotation.x += 0.025;
      } else { mesh_duckbill_ref_geometry.rotation.x = 1 }
    } else {
      if (duckbill_down.rotation.x > 0.35) {
        duckbill_down.rotation.x -= 0.025;
      } else { mesh_duckbill_ref_geometry.rotation.x = 0 }
    }

    // Movimenta as pernas
    if (flag_legs) {
      if (left_leg.rotation.x < 0.5) {
        left_leg.rotation.x += 0.05;
      } else { mesh_legs_ref_geometry.rotation.x = 1; }
    } else {
      if (left_leg.rotation.x > -0.5) {
        left_leg.rotation.x -= 0.05;
      } else { mesh_legs_ref_geometry.rotation.x = 0; }
    }
    right_leg.rotation.x = left_leg.rotation.x * -1;

    // Movimenta as asas
    if (flag_wings) {
      if (left_wing.rotation.y < 0.75) {
        left_wing.rotation.y += 0.05;
      } else { mesh_wings_ref_geometry.rotation.x = 1 }
    } else {
      if (left_wing.rotation.y > 0) {
        left_wing.rotation.y -= 0.05;
      } else { mesh_wings_ref_geometry.rotation.x = 0 }
    }
    right_wing.rotation.y = left_wing.rotation.y * -1;

    // Movimenta o corpo
    if (left_leg.rotation.x < 0) {
      if (pivot_all.rotation.z < 0.25) {
        pivot_all.rotation.z += 0.025;
      } else {
        pivot_all.rotation.z -= 0.025;
      }
    } else {
      if (pivot_all.rotation.z > -0.25) {
        pivot_all.rotation.z -= 0.025;
      } else {
        pivot_all.rotation.z += 0.025;
      }
    }
  }

  move();

  renderer.render(scene, camera);
};

function stopDuckAnimation() {
  cancelAnimationFrame(ref);
}

function restart() {
  // Redefine a rotação das partes do corpo
  left_wing.rotation.y = rotation_left_wing;
  right_wing.rotation.y = rotation_right_wing;
  duckbill_down.rotation.x = rotation_duckbill_down;
  left_leg.rotation.x = right_leg.rotation.x = 0;
  pivot_all.rotation.z = 0;

  // Redefine a rotação dos objetos de referência
  mesh_legs_ref_geometry.rotation.x = 0;
  mesh_wings_ref_geometry.rotation.x = 0;
  mesh_duckbill_ref_geometry.rotation.x = 0;

  // Redefine a rotação do corpo como um todo
  pivot_all.rotation.y = 0.7;
  pivot_all.rotation.x = 0;

  // Renderiza para mostrar a redefinição
  renderer.render(scene, camera);
}

let currentX = 0;
let currentY = 0;
let mouseDown = false;
document.body.addEventListener("mousemove", (e) => {
  if (mouseDown && e.target != document.querySelector('.actions')) {
    pivot_all.rotation.y -= (currentX - e.pageX) / 100;
    pivot_all.rotation.x -= (currentY - e.pageY) / 100;
    currentX = e.pageX;
    currentY = e.pageY;
  }
  renderer.render(scene, camera);
})
document.body.addEventListener("mousedown", (e) => {
  if (e.target != document.querySelector('.actions')) {
    mouseDown = true;
    currentX = e.pageX;
    currentY = e.pageY;
  }
})
document.body.addEventListener("mouseup", (e) => {
  if (e.target != document.querySelector('.actions')) {
    mouseDown = false;
  }
})

pivot_all.rotation.y = 0.7;
pivot_all.rotation.x = 0;
pivot_all.position.y = -0.8;

pivot_head.add(pivot_duckbill);
pivot_all.add(pivot_head);
pivot_all.add(pivot_body);

scene.add(pivot_all);

camera.position.z = 6;

renderer.render(scene, camera);