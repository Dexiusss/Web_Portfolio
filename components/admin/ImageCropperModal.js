"use client";

import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react';

export default function ImageCropperModal({ imageSrc, onClose, onCropComplete }) {
  const [imgElement, setImgElement] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Crop Box state relative to container canvas
  const [cropBox, setCropBox] = useState({ x: 50, y: 25, width: 240, height: 320 });
  const [activeHandle, setActiveHandle] = useState(null);
  const [handleDragStart, setHandleDragStart] = useState({ x: 0, y: 0, box: null });

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Load Image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgElement(img);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Draw main viewport canvas
  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Center of canvas
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);

    // Calculate aspect scale to fit image inside container initially
    const fitScale = Math.min(width / imgElement.width, height / imgElement.height);
    const drawWidth = imgElement.width * fitScale;
    const drawHeight = imgElement.height * fitScale;

    ctx.drawImage(imgElement, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }, [imgElement, zoom, pan]);

  // Handle Mouse / Touch for Panning Image
  const handleMouseDown = (e) => {
    if (activeHandle) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (activeHandle && handleDragStart.box) {
      const dx = e.clientX - handleDragStart.x;
      const dy = e.clientY - handleDragStart.y;
      const b = handleDragStart.box;

      let newBox = { ...b };
      if (activeHandle.includes('e')) newBox.width = Math.max(80, b.width + dx);
      if (activeHandle.includes('s')) newBox.height = Math.max(100, b.height + dy);
      if (activeHandle.includes('w')) {
        const nw = Math.max(80, b.width - dx);
        newBox.x = b.x + (b.width - nw);
        newBox.width = nw;
      }
      if (activeHandle.includes('n')) {
        const nh = Math.max(100, b.height - dy);
        newBox.y = b.y + (b.height - nh);
        newBox.height = nh;
      }
      setCropBox(newBox);
      return;
    }

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  // Handle Corner Drag Start
  const startHandleDrag = (handle, e) => {
    e.stopPropagation();
    setActiveHandle(handle);
    setHandleDragStart({
      x: e.clientX,
      y: e.clientY,
      box: { ...cropBox }
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCropBox({ x: 50, y: 25, width: 240, height: 320 });
  };

  // Perform Final Crop Output
  const handleSaveCrop = () => {
    if (!imgElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropBox.width * 2; // High DPI output
    cropCanvas.height = cropBox.height * 2;
    const cropCtx = cropCanvas.getContext('2d');

    // Source image dimensions and drawn dimensions
    const width = canvas.width;
    const height = canvas.height;
    const fitScale = Math.min(width / imgElement.width, height / imgElement.height);
    const drawWidth = imgElement.width * fitScale * zoom;
    const drawHeight = imgElement.height * fitScale * zoom;

    // Center coordinates of image on canvas
    const imgCenterX = width / 2 + pan.x;
    const imgCenterY = height / 2 + pan.y;

    const imgLeftOnCanvas = imgCenterX - drawWidth / 2;
    const imgTopOnCanvas = imgCenterY - drawHeight / 2;

    // Crop box coordinates relative to image top-left
    const cropXOnImg = (cropBox.x - imgLeftOnCanvas) / (drawWidth / imgElement.width);
    const cropYOnImg = (cropBox.y - imgTopOnCanvas) / (drawHeight / imgElement.height);
    const cropWOnImg = cropBox.width / (drawWidth / imgElement.width);
    const cropHOnImg = cropBox.height / (drawHeight / imgElement.height);

    cropCtx.drawImage(
      imgElement,
      cropXOnImg,
      cropYOnImg,
      cropWOnImg,
      cropHOnImg,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );

    cropCanvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], `cropped-thumb-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const croppedUrl = URL.createObjectURL(blob);
      onCropComplete(croppedFile, croppedUrl);
      onClose();
    }, 'image/jpeg', 0.92);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-card-bg)',
        color: 'var(--color-dark)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Crop Thumbnail</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Drag image or adjust crop box for Circular Gallery & Experiences
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-dark)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cropping Canvas Viewport */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: 'relative',
            width: '100%',
            height: '370px',
            background: '#111',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          <canvas
            ref={canvasRef}
            width={340}
            height={370}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Interactive Bounding Crop Box Overlay */}
          <div style={{
            position: 'absolute',
            left: `${cropBox.x}px`,
            top: `${cropBox.y}px`,
            width: `${cropBox.width}px`,
            height: `${cropBox.height}px`,
            border: '2px solid var(--color-pink)',
            borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
            pointerEvents: 'none'
          }}>
            {/* Grid Guide Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.3, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
              <div style={{ borderRight: '1px dashed #fff', borderBottom: '1px dashed #fff' }} />
              <div style={{ borderRight: '1px dashed #fff', borderBottom: '1px dashed #fff' }} />
              <div style={{ borderBottom: '1px dashed #fff' }} />
              <div style={{ borderRight: '1px dashed #fff', borderBottom: '1px dashed #fff' }} />
              <div style={{ borderRight: '1px dashed #fff', borderBottom: '1px dashed #fff' }} />
              <div style={{ borderBottom: '1px dashed #fff' }} />
            </div>

            {/* Resize Handles */}
            <div onMouseDown={(e) => startHandleDrag('nw', e)} style={{ position: 'absolute', top: -6, left: -6, width: 14, height: 14, background: '#fff', border: '2px solid var(--color-pink)', borderRadius: '50%', cursor: 'nwse-resize', pointerEvents: 'auto' }} />
            <div onMouseDown={(e) => startHandleDrag('ne', e)} style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, background: '#fff', border: '2px solid var(--color-pink)', borderRadius: '50%', cursor: 'nesw-resize', pointerEvents: 'auto' }} />
            <div onMouseDown={(e) => startHandleDrag('sw', e)} style={{ position: 'absolute', bottom: -6, left: -6, width: 14, height: 14, background: '#fff', border: '2px solid var(--color-pink)', borderRadius: '50%', cursor: 'nesw-resize', pointerEvents: 'auto' }} />
            <div onMouseDown={(e) => startHandleDrag('se', e)} style={{ position: 'absolute', bottom: -6, right: -6, width: 14, height: 14, background: '#fff', border: '2px solid var(--color-pink)', borderRadius: '50%', cursor: 'nwse-resize', pointerEvents: 'auto' }} />
          </div>
        </div>

        {/* Zoom & Control Sliders */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(0,0,0,0.03)', padding: '0.8rem 1.2rem', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
            <ZoomOut size={18} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--color-pink)', cursor: 'pointer' }}
            />
            <ZoomIn size={18} style={{ color: 'var(--color-text-muted)' }} />
          </div>

          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: 'var(--color-dark)'
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Footer Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="pill-button"
            style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-dark)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            className="pill-button pill-button-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem' }}
          >
            <Check size={18} /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
