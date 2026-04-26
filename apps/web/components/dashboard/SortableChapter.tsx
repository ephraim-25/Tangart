"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableChapterProps {
  id: string;
  title: string;
  lessonCount: number;
}

export function SortableChapter(props: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass ${isDragging ? 'glass-heavy' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'grab'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 500 }}>{props.title}</h4>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{props.lessonCount} Leçons</span>
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: 'var(--text-sm)' }} onPointerDown={(e) => e.stopPropagation()}>Éditer</button>
      </div>
    </div>
  );
}
