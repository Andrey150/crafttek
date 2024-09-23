import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, RegularPolygon } from 'react-konva';
import './App.css';

type ShapeType = 'rectangle' | 'circle' | 'triangle';

interface Shape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
}

function App() {
  const [stageScale, setStageScale] = useState<number>(1); // Масштабирование
  const [stagePosition, setStagePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // Панорамирование
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null); // Выбранная фигура
  const [isCursorMode, setIsCursorMode] = useState<boolean>(false); // Режим курсора
  const [shapes, setShapes] = useState<Shape[]>([]); // Список фигур
  const stageRef = useRef<any>(null);

  // Обработчик масштабирования
  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX(); 
    const pointer = stage.getPointerPosition(); 

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  // Добавление новой фигуры на холст
  const addShape = (shapeType: ShapeType) => {
    const newShape = {
      id: shapes.length + 1,
      type: shapeType,
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    setShapes([...shapes, newShape]);
  };

  // Выбор фигуры из выпадающего списка
  const handleShapeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShape(e.target.value as ShapeType);
  };

  // Обработчик клика для добавления фигуры
  const handleAddShapeClick = () => {
    if (selectedShape) {
      addShape(selectedShape);
    }
  };

  // Переключение режима
  const toggleCursorMode = () => {
    setIsCursorMode((prevMode) => !prevMode);
  };

  // Обработчик для изменения позиции фигуры во время перетаскивания
  const handleShapeDragMove = (e: any, id: number) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return { ...shape, x: e.target.x(), y: e.target.y() };
      }
      return shape;
    });
    setShapes(updatedShapes);
  };

  // Обработчик для окончания перетаскивания фигуры
  const handleShapeDragEnd = (e: any, id: number) => {
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return { ...shape, x: e.target.x(), y: e.target.y() };
      }
      return shape;
    });
    setShapes(updatedShapes);
  };

  return (
    <>
      <div className="toolbar">
        <div>
          <select onChange={handleShapeSelect} value={selectedShape || ''}>
            <option value="" disabled>
              Выберите фигуру
            </option>
            <option value="rectangle">Прямоугольник</option>
            <option value="circle">Круг</option>
            <option value="triangle">Треугольник</option>
          </select>
          <button onClick={handleAddShapeClick} disabled={!selectedShape}>
            Добавить фигуру
          </button>
        </div>
        <button onClick={toggleCursorMode}>
          {isCursorMode ? 'Режим рисования' : 'Режим курсора'}
        </button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={!isCursorMode}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        ref={stageRef}
        style={{ background: '#f0f0f0' }}
      >
        <Layer>
          {shapes.map((shape) => {
            switch (shape.type) {
              case 'rectangle':
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={100}
                    height={100}
                    fill="red"
                    draggable={isCursorMode}
                    onDragMove={(e) => handleShapeDragMove(e, shape.id)}
                    onDragEnd={(e) => handleShapeDragEnd(e, shape.id)} 
                  />
                );
              case 'circle':
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={50}
                    fill="blue"
                    draggable={isCursorMode}
                    onDragMove={(e) => handleShapeDragMove(e, shape.id)}
                    onDragEnd={(e) => handleShapeDragEnd(e, shape.id)}
                  />
                );
              case 'triangle':
                return (
                  <RegularPolygon
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    sides={3}
                    radius={50}
                    fill="green"
                    draggable={isCursorMode}
                    onDragMove={(e) => handleShapeDragMove(e, shape.id)}
                    onDragEnd={(e) => handleShapeDragEnd(e, shape.id)}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
