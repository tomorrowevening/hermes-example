/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { WebGLRenderer } from 'three';
import studio from '@theatre/studio';
import { getProject, types } from '@theatre/core';
import { customizeTheatreElements, RemoteTheatre, RemoteThree, rgbaToHex, SceneInspector, ThreeEditor } from '@tomorrowevening/hermes';
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
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TheatreJS example
  useEffect(() => {
    console.log('Theatre Setup');
    theatre.project = getProject('Remote Theatre Example', {
      state: {
        "sheetsById": {
          "Example Sheet": {
            "staticOverrides": {
              "byObject": {
                "Example": {
                  "position": {
                    "x": 100,
                    "y": 100
                  },
                  "color": {
                    "r": 1,
                    "g": 1,
                    "b": 1,
                    "a": 1
                  }
                }
              }
            },
            "sequence": {
              "subUnitsPerUnit": 30,
              "length": 10,
              "type": "PositionalSequence",
              "tracksByObject": {
                "Example": {
                  "trackData": {},
                  "trackIdByPropPath": {}
                }
              }
            }
          }
        },
        "definitionVersion": "0.4.0",
        "revisionHistory": [
          "XqcoKBXmvWlUT0RV",
          "0_X3SHD4kxF4l9IB"
        ]
      },
    });

    theatre.project.ready.then(() => {
      console.log('Project ready');

      const sheetName = 'Example Sheet';
      theatre.sheet(sheetName);
      theatre.sheetObject(sheetName, 'Example', {
        color: types.rgba({ r: 255, g: 255, b: 255, a: 1 }),
        position: {
          x: 0,
          y: 0,
        },
      }, (values: any) => {
        console.log(values);
        const div = divRef.current;
        if (div === null) return;

        div.style.left = `${values.position.x}px`;
        div.style.top = `${values.position.y}px`;
        div.style.backgroundColor = rgbaToHex(values.color);
      });
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
    three.addScene(scene);
    three.setScene(scene);
    three.addCamera(scene.camera);

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
      {IS_DEV && (
        <>
          <SceneInspector three={three} />

          {IS_EDITOR && (
            <ThreeEditor
              three={three}
              scenes={scenes}
              onSceneUpdate={(scene: any) => {
                scene.update();
              }}
            />
          )}
        </>
      )}
      
      {!IS_EDITOR && (
        <>
          <canvas ref={canvasRef} />
          <div id="box" ref={divRef}></div>
        </>
      )}
    </>
  );
}
