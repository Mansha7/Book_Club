"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/assets/components/tiptap-ui-primitive/button"
import { Spacer } from "@/assets/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/assets/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/assets/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/assets/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/assets/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/assets/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/assets/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/assets/components/tiptap-node/list-node/list-node.scss"
import "@/assets/components/tiptap-node/image-node/image-node.scss"
import "@/assets/components/tiptap-node/heading-node/heading-node.scss"
import "@/assets/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- AI Hints Extension ---
import { AIHintExtension } from "@/assets/components/tiptap-extension/ai-hint-extension"
import "@/assets/components/tiptap-extension/ai-hint-styles.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/assets/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/assets/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/assets/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/assets/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/assets/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/assets/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/assets/components/tiptap-ui/link-popover"
import { MarkButton } from "@/assets/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/assets/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/assets/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/assets/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/assets/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/assets/components/tiptap-icons/link-icon"
import { SparklesIcon } from "@/assets/components/tiptap-icons/sparkles-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/assets/hooks/use-is-breakpoint"
import { useWindowSize } from "@/assets/hooks/use-window-size"
import { useCursorVisibility } from "@/assets/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/assets/components/tiptap-templates/simple/theme-toggle"
import { AISuggestionsPanel } from "@/assets/components/tiptap-ui/ai-suggestions-panel"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/assets/lib/tiptap-utils"

// --- Styles ---
import "@/assets/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/assets/components/tiptap-templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onAIClick,
  onSaveDraft,
  onPublish,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  onAIClick: () => void
  onSaveDraft: () => void
  onPublish: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <Button
          variant="ghost"
          onClick={onAIClick}
          aria-label="AI Writing Assistant"
          className="ai-assistant-button"
        >
          <SparklesIcon className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          variant="ghost"
          onClick={onSaveDraft}
          aria-label="Save Draft"
          className="save-draft-button"
        >
          💾 Save Draft
        </Button>
        <Button
          variant="ghost"
          onClick={onPublish}
          aria-label="Publish"
          className="publish-button"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          🚀 Publish
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  // AI Assistant state
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Placeholder.configure({
        placeholder: "Start typing to create content...",
        emptyEditorClass: "is-editor-empty",
      }),
      AIHintExtension.configure({
        enabled: true,
        debounceMs: 5000, // Wait 5 seconds after typing stops
        minWordCount: 30, // Show hints after 30 words
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  // Save draft handler
  const handleSaveDraft = () => {
    if (!editor) return;
    
    const content = editor.getJSON();
    const htmlContent = editor.getHTML();
    
    // Save to localStorage for now (you can replace with API call)
    localStorage.setItem('draft_content', JSON.stringify(content));
    localStorage.setItem('draft_html', htmlContent);
    localStorage.setItem('draft_saved_at', new Date().toISOString());
    
    alert('✅ Draft saved successfully!');
  };

  // Publish handler
  const handlePublish = () => {
    if (!editor) return;
    
    const content = editor.getJSON();
    const htmlContent = editor.getHTML();
    const textContent = editor.getText();
    
    if (textContent.trim().length < 50) {
      alert('⚠️ Please write at least 50 characters before publishing.');
      return;
    }
    
    // Here you would typically send to your backend API
    console.log('Publishing content:', {
      json: content,
      html: htmlContent,
      text: textContent,
    });
    
    alert('🚀 Content published successfully!');
    
    // Optionally clear draft
    localStorage.removeItem('draft_content');
    localStorage.removeItem('draft_html');
    localStorage.removeItem('draft_saved_at');
  };

  // Fetch AI suggestions
  const fetchAISuggestions = async () => {
    if (!editor) return
    
    const content = editor.getText()
    if (!content || content.trim().length < 50) {
      alert("Please write at least 50 characters to get AI suggestions.")
      return
    }

    setIsLoadingAI(true)
    setShowAISuggestions(true)
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await response.json()
      setAiSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
      alert('Failed to get AI suggestions. Please try again.')
      setShowAISuggestions(false)
    } finally {
      setIsLoadingAI(false)
    }
  }

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              onAIClick={fetchAISuggestions}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />

        {showAISuggestions && (
          <AISuggestionsPanel
            suggestions={aiSuggestions}
            isLoading={isLoadingAI}
            onClose={() => setShowAISuggestions(false)}
            onRefresh={fetchAISuggestions}
          />
        )}
      </EditorContext.Provider>
    </div>
  )
}
