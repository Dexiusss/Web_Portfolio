import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform, Raycast, Vec2 } from 'ogl';
import { useEffect, useRef } from 'react';

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

// Function to wrap text
function wrapText(context, text, maxWidth) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  if (lines.length > 2) {
    return [lines[0], lines[1] + '...'];
  }
  return lines;
}

// Custom function to create texture with title and category
function createTextTexture(gl, title, category, font = 'bold 30px sans-serif', categoryFont = '20px sans-serif', color = 'white', maxTextureWidth = 600) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = font;
  const titleLines = wrapText(context, title, maxTextureWidth);

  context.font = categoryFont;
  const categoryLines = wrapText(context, category, maxTextureWidth);

  const titleLineHeight = Math.ceil(getFontSize(font) * 1.2);
  const categoryLineHeight = Math.ceil(getFontSize(categoryFont) * 1.2);

  let actualMaxWidth = 0;
  context.font = font;
  titleLines.forEach(line => {
    actualMaxWidth = Math.max(actualMaxWidth, context.measureText(line).width);
  });
  context.font = categoryFont;
  categoryLines.forEach(line => {
    actualMaxWidth = Math.max(actualMaxWidth, context.measureText(line).width);
  });

  canvas.width = Math.min(Math.ceil(actualMaxWidth) + 20, maxTextureWidth + 20);
  canvas.height = (titleLines.length * titleLineHeight) + (categoryLines.length * categoryLineHeight) + 20;

  context.fillStyle = color;
  context.textBaseline = 'top';
  context.textAlign = 'left';

  // Add drop shadow for better readability over any image
  context.shadowColor = 'rgba(0, 0, 0, 0.9)';
  context.shadowBlur = 8;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 2;

  let y = 10;
  context.font = font;
  titleLines.forEach(line => {
    context.fillText(line, 10, y);
    y += titleLineHeight;
  });

  context.font = categoryFont;
  context.globalAlpha = 0.8;
  categoryLines.forEach(line => {
    context.fillText(line, 10, y);
    y += categoryLineHeight;
  });
  context.globalAlpha = 1.0;

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, title, category, textColor = '#ffffff', font = 'bold 36px sans-serif', categoryFont = '20px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.title = title;
    this.category = category;
    this.textColor = textColor;
    this.font = font;
    this.categoryFont = categoryFont;
    this.createMesh();
  }
  createMesh() {
    // We use a slightly narrower max texture width so text wraps earlier and appears larger when scaled
    const { texture, width, height } = createTextTexture(this.gl, this.title, this.category, this.font, this.categoryFont, this.textColor, 450);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
      depthTest: false,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });

    const planeWidth = this.plane.scale.x;
    const maxTextWidth = planeWidth * 0.9;
    const scaleFactor = maxTextWidth / 470; // 470 is maxTextureWidth (450) + padding (20)

    let textWidth = width * scaleFactor;
    let textHeight = height * scaleFactor;

    this.mesh.scale.set(textWidth, textHeight, 1);

    // Position inside the box, at bottom left
    this.mesh.position.y = -this.plane.scale.y * 0.5 + textHeight * 0.5 + 0.15;
    this.mesh.position.x = -this.plane.scale.x * 0.5 + textWidth * 0.5 + 0.02;
    // slightly in front
    this.mesh.position.z = 0.01;

    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    itemData,
    index,
    length,
    renderer,
    scene,
    screen,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    categoryFont
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.itemData = itemData;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.categoryFont = categoryFont;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 1.0
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          // Gradient at the bottom half (y from 0 to 0.5)
          float gradient = smoothstep(0.6, 0.0, vUv.y) * 0.8;
          color.rgb = mix(color.rgb, vec3(0.0), gradient);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    // Add reference for raycasting
    this.plane.mediaData = this.itemData;
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      title: this.itemData.title,
      category: this.itemData.category,
      textColor: this.textColor,
      font: this.font,
      categoryFont: this.categoryFont
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    const isMobile = this.screen ? this.screen.width < 768 : false;
    const currentBend = isMobile ? 0.25 : this.bend * 0.8;

    if (currentBend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(currentBend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (currentBend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    const isMobile = this.screen.width < 768;
    this.scale = this.screen.height / 1500;
    const cardHeight = isMobile ? 700 : 860;
    const cardWidth = isMobile ? 520 : 650;
    this.plane.scale.y = (this.viewport.height * (cardHeight * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (cardWidth * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    // Bounds for raycasting
    this.plane.geometry.computeBoundingBox();

    this.padding = isMobile ? 1.3 : 1.4;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 24px Figtree',
      categoryFont = '14px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      onClick
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.onClickCallback = onClick;
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font, categoryFont);

    this.raycast = new Raycast(this.gl);
    this.mouse = new Vec2();

    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font, categoryFont) {
    const galleryItems = items && items.length ? items : [];
    // Ensure we have enough items to loop seamlessly.
    // If not, duplicate them.
    let displayItems = [...galleryItems];
    if (displayItems.length > 0 && displayItems.length < 8) {
      displayItems = [...displayItems, ...displayItems, ...displayItems];
    }
    this.mediasImages = displayItems;
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.thumbnail_url || (Array.isArray(data.content_blocks) ? data.content_blocks.find(b => b.type === '_meta')?.thumbnail_url : null) || data.image_url || data.imageUrl,
        itemData: data,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        categoryFont
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.isDrag = false;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.downStart = Date.now();
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
    if (Math.abs(this.start - x) > 5) {
      this.isDrag = true;
    }
  }
  onTouchUp(e) {
    this.isDown = false;
    this.onCheck();

    // Check for click
    if (!this.isDrag && Date.now() - this.downStart < 300) {
      this.handleClick(e);
    }
  }

  handleClick(e) {
    if (!this.onClickCallback) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    const rect = this.container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.mouse.set(
      (x / this.screen.width) * 2 - 1,
      -(y / this.screen.height) * 2 + 1
    );

    this.raycast.castMouse(this.camera, this.mouse);
    const meshes = this.medias.map(m => m.plane);
    const hits = this.raycast.intersectBounds(meshes);

    if (hits.length > 0 && hits[0].mediaData) {
      this.onClickCallback(hits[0].mediaData);
    }
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;

      default:
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('mousewheel', this.boundOnWheel, { passive: true });
    window.addEventListener('wheel', this.boundOnWheel, { passive: true });
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);

    this.container?.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mousewheel', this.boundOnWheel);
    window.removeEventListener('wheel', this.boundOnWheel);
    window.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchstart', this.boundOnTouchDown);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }

    if (this.container) {
      this.container.removeEventListener('keydown', this.boundOnKeyDown);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 24px Figtree',
  categoryFont = '16px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05,
  onClick
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current || !items || items.length === 0) return;
    let app;
    let isMounted = true;

    // Ensure document fonts are loaded before initializing to avoid layout shifts
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!isMounted || !containerRef.current) return;
        app = new App(containerRef.current, {
          items,
          bend,
          textColor,
          borderRadius,
          font,
          categoryFont,
          scrollSpeed,
          scrollEase,
          onClick
        });
      }).catch(() => { });
    }

    return () => {
      isMounted = false;
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  if (!items || items.length === 0) return null;

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Use left and right arrow keys to navigate."
    />
  );
}
