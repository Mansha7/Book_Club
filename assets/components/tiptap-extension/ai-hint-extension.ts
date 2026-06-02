import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface AIHintOptions {
  enabled: boolean;
  debounceMs: number;
  minWordCount: number;
}

export const AIHintExtension = Extension.create<AIHintOptions>({
  name: 'aiHint',

  addOptions() {
    return {
      enabled: true,
      debounceMs: 3000, // Wait 3 seconds after typing stops
      minWordCount: 20, // Minimum words before showing hints
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: new PluginKey('aiHint'),
        
        state: {
          init() {
            return DecorationSet.empty;
          },
          
          apply(tr, value) {
            // Check if we have new decorations from the view
            const meta = tr.getMeta('aiHint');
            if (meta?.decorations) {
              return meta.decorations;
            }
            
            // Map existing decorations through changes
            return value.map(tr.mapping, tr.doc);
          },
        },

        props: {
          decorations(state) {
            return this.getState(state) || DecorationSet.empty;
          },
        },

        view(editorView) {
          const generateHintForParagraph = async (paragraphPos: number, paragraphText: string) => {
            if (!extension.options.enabled) return;

            const { state } = editorView;
            const wordCount = paragraphText.split(/\s+/).filter(Boolean).length;

            if (wordCount < 10) return; // Need at least 10 words in paragraph

            try {
              // Call API to get contextual hint for this specific paragraph
              const response = await fetch('/api/ai-hints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: paragraphText }),
              });

              if (!response.ok) return;

              const data = await response.json();
              const hints = data.hints || [];

              if (hints.length === 0) return;

              // Create decoration for this paragraph
              const widget = document.createElement('div');
              widget.className = 'ai-hint-marker';
              widget.textContent = hints[0]; // Use first hint
              
              // Add close button
              const closeBtn = document.createElement('span');
              closeBtn.className = 'ai-hint-close';
              closeBtn.textContent = '×';
              closeBtn.onclick = () => {
                // Remove this decoration
                const tr = editorView.state.tr;
                tr.setMeta('aiHint', { decorations: DecorationSet.empty });
                editorView.dispatch(tr);
              };
              widget.appendChild(closeBtn);

              // Place after the paragraph
              const decoration = Decoration.widget(paragraphPos + paragraphText.length + 1, widget, {
                side: 1,
              });

              // Update plugin state with new decoration
              const tr = state.tr;
              tr.setMeta('aiHint', {
                decorations: DecorationSet.create(state.doc, [decoration]),
              });
              editorView.dispatch(tr);
            } catch (error) {
              console.error('Error generating AI hint:', error);
            }
          };

          // Listen for double-click on paragraphs
          const handleDoubleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Find if we clicked inside a paragraph
            const paragraph = target.closest('p');
            if (!paragraph) return;

            // Get the position of this paragraph in the document
            const pos = editorView.posAtDOM(paragraph, 0);
            const $pos = editorView.state.doc.resolve(pos);
            const node = $pos.parent;

            if (node.type.name === 'paragraph') {
              const paragraphText = node.textContent;
              generateHintForParagraph(pos, paragraphText);
            }
          };

          editorView.dom.addEventListener('dblclick', handleDoubleClick);

          return {
            destroy() {
              editorView.dom.removeEventListener('dblclick', handleDoubleClick);
            },
          };
        },
      }),
    ];
  },
});
