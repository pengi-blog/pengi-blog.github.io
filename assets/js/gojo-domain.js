(function () {
  const container = document.getElementById('domain-expansion-background');
  const trigger = document.getElementById('domain-trigger');
  if (!container || !trigger || !window.THREE) return;

  const CONFIG = { COUNT: 30000 };
  const GLOBAL = { currentTech: 'neutral' };

  class MagicScene {
    constructor() {
      this.targetPositions = new Float32Array(CONFIG.COUNT * 3);
      this.targetColors = new Float32Array(CONFIG.COUNT * 3);
      this.velocities = new Float32Array(CONFIG.COUNT * 3);
      this.init();
    }

    init() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 100;

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      this.setupObjects();
      this.setupParticles();
      this.holdNeutralTargets();
    }

    setupObjects() {
      const sphereGeo = new THREE.SphereGeometry(15, 32, 32);
      this.domainSphere = new THREE.Group();
      this.domainSphere.add(
        new THREE.Mesh(
          sphereGeo,
          new THREE.MeshBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.3 }),
        ),
      );
      this.domainSphere.add(
        new THREE.Mesh(
          sphereGeo,
          new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 }),
        ),
      );
      this.domainSphere.visible = false;
      this.scene.add(this.domainSphere);
    }

    setupParticles() {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(CONFIG.COUNT * 3);
      const col = new Float32Array(CONFIG.COUNT * 3);

      for (let i = 0; i < CONFIG.COUNT; i += 1) {
        pos[i * 3] = (Math.random() - 0.5) * 300;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
        this.resetVelocity(i);
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      this.particles = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.7,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          sizeAttenuation: true,
        }),
      );
      this.scene.add(this.particles);
    }

    resetVelocity(i) {
      this.velocities[i * 3] = (Math.random() - 0.5) * 2;
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    triggerExplosion() {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < CONFIG.COUNT; i += 1) {
        const index = i * 3;
        this.velocities[index] = pos[index] * (Math.random() * 0.5);
        this.velocities[index + 1] = pos[index + 1] * (Math.random() * 0.5);
        this.velocities[index + 2] = pos[index + 2] * (Math.random() * 0.5);
      }
    }

    holdNeutralTargets() {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < CONFIG.COUNT * 3; i += 1) {
        this.targetPositions[i] = pos[i];
        this.targetColors[i] = 1;
      }
    }

    updateTechnique(type) {
      if (GLOBAL.currentTech === type) return;
      if (GLOBAL.currentTech !== 'neutral' && type === 'neutral') this.triggerExplosion();

      GLOBAL.currentTech = type;
      this.domainSphere.visible = type === 'gojo';

      if (type === 'neutral') {
        this.holdNeutralTargets();
        return;
      }

      for (let i = 0; i < CONFIG.COUNT; i += 1) {
        const data = getPatternData(type, i);
        this.targetPositions[i * 3] = data.pos[0];
        this.targetPositions[i * 3 + 1] = data.pos[1];
        this.targetPositions[i * 3 + 2] = data.pos[2];
        this.targetColors[i * 3] = 1;
        this.targetColors[i * 3 + 1] = 1;
        this.targetColors[i * 3 + 2] = 1;
      }
    }

    render() {
      this.domainSphere.rotation.y += 0.01;

      const pos = this.particles.geometry.attributes.position.array;
      const col = this.particles.geometry.attributes.color.array;

      for (let i = 0; i < CONFIG.COUNT; i += 1) {
        const index = i * 3;
        if (GLOBAL.currentTech === 'neutral') {
          pos[index] += this.velocities[index];
          pos[index + 1] += this.velocities[index + 1];
          pos[index + 2] += this.velocities[index + 2];
          this.velocities[index] *= 0.96;
          this.velocities[index + 1] *= 0.96;
          this.velocities[index + 2] *= 0.96;
        }

        const lerp = GLOBAL.currentTech === 'gojo' ? 0.12 : 0;
        pos[index] += (this.targetPositions[index] - pos[index]) * lerp;
        pos[index + 1] += (this.targetPositions[index + 1] - pos[index + 1]) * lerp;
        pos[index + 2] += (this.targetPositions[index + 2] - pos[index + 2]) * lerp;
        col[index] += (this.targetColors[index] - col[index]) * 0.1;
        col[index + 1] += (this.targetColors[index + 1] - col[index + 1]) * 0.1;
        col[index + 2] += (this.targetColors[index + 2] - col[index + 2]) * 0.1;
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.geometry.attributes.color.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
    }
  }

  function getPatternData(type, i) {
    if (type === 'gojo') {
      const phi = Math.acos(-1 + (2 * i) / CONFIG.COUNT);
      const theta = Math.sqrt(CONFIG.COUNT * Math.PI) * phi;
      const radius = 14 + Math.random() * 2;
      return {
        pos: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi),
        ],
      };
    }

    const angle = (i / CONFIG.COUNT) * Math.PI * 2;
    const radius = 20 + Math.random() * 10;
    return {
      pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 20],
    };
  }

  const magicScene = new MagicScene();

  function press() {
    trigger.classList.add('is-held');
    trigger.setAttribute('aria-pressed', 'true');
    magicScene.updateTechnique('gojo');
  }

  function release() {
    trigger.classList.remove('is-held');
    trigger.setAttribute('aria-pressed', 'false');
    magicScene.updateTechnique('neutral');
  }

  trigger.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    trigger.setPointerCapture(event.pointerId);
    press();
  });
  trigger.addEventListener('pointerup', release);
  trigger.addEventListener('pointercancel', release);
  trigger.addEventListener('lostpointercapture', release);
  trigger.addEventListener('keydown', (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      event.preventDefault();
      press();
    }
  });
  trigger.addEventListener('keyup', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      release();
    }
  });

  window.addEventListener('resize', () => {
    magicScene.camera.aspect = window.innerWidth / window.innerHeight;
    magicScene.camera.updateProjectionMatrix();
    magicScene.renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    magicScene.render();
    window.requestAnimationFrame(animate);
  }
  animate();
})();
