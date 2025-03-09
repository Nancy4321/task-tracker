export type ReorderCallback = (startIndex: number, endIndex: number) => void;

/**
 * Initializes drag and drop for a list of elements
 * @param containerSelector - CSS selector for the container
 * @param itemSelector - CSS selector for draggable items
 * @param onReorder - Callback function when items are reordered
 */
export function initDragAndDrop(
  containerSelector: string, 
  itemSelector: string, 
  onReorder: ReorderCallback
): void {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  let draggedElement: Element | null = null;
  let draggedElementIndex: number | null = null;

  const getElementIndex = (element: Element): number => {
    const parent = element.parentNode as Element;
    return Array.from(parent.children).indexOf(element);
  };

  container.addEventListener('dragstart', (e: DragEvent) => {
    if (!e.target) return;
    
    const item = (e.target as Element).closest(itemSelector);
    if (!item) return;
    
    draggedElement = item;
    draggedElementIndex = getElementIndex(item);
    
    item.classList.add('dragging');
    
    e.dataTransfer?.setData('text/plain', draggedElementIndex.toString());
  });

  container.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    
    if (!e.target) return;
    
    const item = (e.target as Element).closest(itemSelector);
    if (!item || item === draggedElement) return;
    
    const rect = item.getBoundingClientRect();
    const y = e.clientY;
    const threshold = rect.top + rect.height / 2;
    
    const dragOverElements = container.querySelectorAll('.drag-over-before, .drag-over-after');
    dragOverElements.forEach(el => {
      el.classList.remove('drag-over-before', 'drag-over-after');
    });
    
    if (y < threshold) {
      item.classList.add('drag-over-before');
    } else {
      item.classList.add('drag-over-after');
    }
  });

  container.addEventListener('dragleave', (e: DragEvent) => {
    if (!e.target) return;
    
    const item = (e.target as Element).closest(itemSelector);
    if (!item) return;
    
    item.classList.remove('drag-over-before', 'drag-over-after');
  });

  container.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    
    if (!e.target) return;
    
    const item = (e.target as Element).closest(itemSelector);
    if (!item || !draggedElement || draggedElementIndex === null) return;
    
    const dropIndex = getElementIndex(item);
    
    let finalDropIndex = dropIndex;
    if (item.classList.contains('drag-over-after')) {
      finalDropIndex = dropIndex + (dropIndex > draggedElementIndex ? 0 : 1);
    } else {
      finalDropIndex = dropIndex - (dropIndex < draggedElementIndex ? 0 : 1);
    }
    
    item.classList.remove('drag-over-before', 'drag-over-after');
    
    if (draggedElementIndex !== finalDropIndex) {
      onReorder(draggedElementIndex, finalDropIndex);
    }
  });

  container.addEventListener('dragend', () => {
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
      draggedElement = null;
    }
    
    const dragOverElements = container.querySelectorAll('.drag-over-before, .drag-over-after');
    dragOverElements.forEach(el => {
      el.classList.remove('drag-over-before', 'drag-over-after');
    });
  });
}

/**
 * Destroys drag and drop (for cleanup purposes)
 * @param containerSelector - CSS selector for the container
 */
export function destroyDragAndDrop(containerSelector: string): void {
  const container = document.querySelector(containerSelector);
  if (!container) return;
} 