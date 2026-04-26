"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableChapter } from './SortableChapter';

export function CourseBuilder() {
  const [chapters, setChapters] = useState([
    { id: 'chap-1', title: 'Fondamentaux de la composition', lessonCount: 3 },
    { id: 'chap-2', title: 'Théorie de la lumière', lessonCount: 5 },
    { id: 'chap-3', title: 'Le drapé classique', lessonCount: 4 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        // TODO: Here we would trigger the PATCH request to /courses/:id/chapters
        // to sync the new orderIndex array to the PostgreSQL database via Prisma.
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)' }}>Programme du cours</h2>
        <button className="btn btn-primary">+ Ajouter un chapitre</button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SortableContext
            items={chapters.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableChapter key={chapter.id} {...chapter} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
