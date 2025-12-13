/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { WebGLRenderer } from 'three';
import studio from '@theatre/studio';
import { getProject } from '@theatre/core';
import { customizeTheatreElements, RemoteTheatre, RemoteThree, ThreeEditor } from '@tomorrowevening/hermes';
import '@tomorrowevening/hermes/hermes.css';
import { IS_DEV, IS_EDITOR } from './constants';
import ExampleScene from './ExampleScene';

// Remotes
const three = new RemoteThree('Three Example', IS_DEV, IS_EDITOR);
const theatre = new RemoteTheatre(IS_DEV, IS_EDITOR);

if (IS_DEV) {
  studio.initialize();
  theatre.studio = studio;
  theatre.handleEditorApp();
  if (IS_EDITOR) customizeTheatreElements();
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TheatreJS example
  useEffect(() => {
    theatre.project = getProject('Remote Theatre Example', {
      state: {
        "sheetsById": {
        },
        "definitionVersion": "0.4.0",
        "revisionHistory": [
          "0_X3SHD4kxF4l9IB"
        ]
      },
    });

    theatre.project.ready.then(() => {
      console.log('Project ready');
    });
    return () => {
      theatre.dispose();
    };
  }, []);

  // ThreeJS Example
  useEffect(() => {
    if (IS_EDITOR) return;

    const canvas = canvasRef.current;
    if (canvas === null) return;

    // Renderer
    const renderer = new WebGLRenderer({
      canvas,
      stencil: false,
    });
    three.setRenderer(renderer, canvas);

    // Scene
    const scene = new ExampleScene();
    scene.init(three);

    // Events

    let raf = -1;

    function update() {
      scene.update();
    }

    function draw() {
      renderer.render(scene, scene.camera);
    }

    function onResize() {
      const width = innerWidth;
      const height = innerHeight;

      renderer.setSize(width, height);
      scene.resize();
    }

    function onUpdate() {
      update();
      draw();
      raf = requestAnimationFrame(onUpdate);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = -1;
    }

    window.addEventListener('resize', onResize);
    onResize();
    onUpdate();


    return () => {
      window.removeEventListener('resize', onResize);
      stop();
      renderer.dispose();
    };
  }, []);

  const scenes = new Map();
  scenes.set(ExampleScene.Name, ExampleScene);

  return (
    <>
      {IS_EDITOR && (
        <ThreeEditor
          three={three}
          scenes={scenes}
          onSceneAdd={(scene: any) => {
            scene.init(three);
          }}
          onSceneUpdate={(scene: any) => {
            scene.update();
          }}
        />
      )}
      
      {!IS_EDITOR && (
        <>
          <canvas ref={canvasRef} />
        </>
      )}
    </>
  );
}
