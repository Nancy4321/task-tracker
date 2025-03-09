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

  container.addEventListener('dragstart', (e: Event) => {
    const dragEvent = e as DragEvent;
    if (!dragEvent.target) return;

    const item = (dragEvent.target as Element).closest(itemSelector);
    if (!item) return;

    draggedElement = item;
    draggedElementIndex = getElementIndex(item);

    item.classList.add('dragging');

    dragEvent.dataTransfer?.setData('text/plain', draggedElementIndex.toString());

    const rect = item.getBoundingClientRect();
    const dragImage = item.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = `${rect.top}px`;
    dragImage.style.left = `${rect.left}px`;
    dragImage.style.width = `${rect.width}px`;
    dragImage.style.height = `${rect.height}px`;
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    dragEvent.dataTransfer?.setDragImage(dragImage, rect.width / 2, rect.height / 2);

    setTimeout(() => document.body.removeChild(dragImage), 0);
  });

  container.addEventListener('dragover', (e: Event) => {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();

    if (!dragEvent.target) return;

    const item = (dragEvent.target as Element).closest(itemSelector);
    if (!item || item === draggedElement) return;

    const rect = item.getBoundingClientRect();
    const y = dragEvent.clientY;
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

  container.addEventListener('dragleave', (e: Event) => {
    const dragEvent = e as DragEvent;
    if (!dragEvent.target) return;
    
    const item = (dragEvent.target as Element).closest(itemSelector);
    if (!item) return;
    
    item.classList.remove('drag-over-before', 'drag-over-after');
  });

  container.addEventListener('drop', (e: Event) => {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();

    if (!dragEvent.target) return;

    const item = (dragEvent.target as Element).closest(itemSelector);
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
      const parent = draggedElement.parentNode as Element;
      const referenceElement = parent.children[finalDropIndex] || null;
      parent.insertBefore(draggedElement, referenceElement);

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

  container.removeEventListener('dragstart', () => {});
  container.removeEventListener('dragover', () => {});
  container.removeEventListener('dragleave', () => {});
  container.removeEventListener('drop', () => {});
  container.removeEventListener('dragend', () => {});
}