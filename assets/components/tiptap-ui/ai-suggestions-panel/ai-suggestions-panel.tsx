"use client"

import { useState } from "react"
import { Button } from "@/assets/components/tiptap-ui-primitive/button"
import { Card } from "@/assets/components/tiptap-ui-primitive/card"
import { CloseIcon } from "@/assets/components/tiptap-icons/close-icon"
import "./ai-suggestions-panel.scss"

interface AISuggestionsPanelProps {
  suggestions: string[]
  isLoading: boolean
  onClose: () => void
  onRefresh: () => void
}

export function AISuggestionsPanel({
  suggestions,
  isLoading,
  onClose,
  onRefresh,
}: AISuggestionsPanelProps) {
  return (
    <div className="ai-suggestions-panel">
      <Card className="ai-suggestions-card">
        <div className="ai-suggestions-header">
          <div className="ai-suggestions-title">
            <span className="ai-icon">✨</span>
            <h3>Creative Suggestions</h3>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close suggestions"
          >
            <CloseIcon className="tiptap-button-icon" />
          </Button>
        </div>

        <div className="ai-suggestions-content">
          {isLoading ? (
            <div className="ai-suggestions-loading">
              <div className="loading-spinner"></div>
              <p>✨ Analyzing your writing...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="ai-suggestions-list">
              {suggestions.map((suggestion, index) => {
                const labels = ['💡 Idea', '🎨 Perspective', '✍️ Style', '🔍 Depth', '⚡ Impact'];
                return (
                  <li key={index} className="ai-suggestion-item">
                    <div className="suggestion-icon">{index + 1}</div>
                    <div className="suggestion-content">
                      <span className="suggestion-label">{labels[index] || '💭 Thought'}</span>
                      <p>{suggestion}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="ai-suggestions-empty">
              <div className="empty-icon">✨</div>
              <p>Write at least 50 characters to receive<br />personalized creative suggestions</p>
            </div>
          )}
        </div>

        {!isLoading && suggestions.length > 0 && (
          <div className="ai-suggestions-footer">
            <Button
              variant="ghost"
              onClick={onRefresh}
              className="refresh-button"
            >
              🔄 Get New Suggestions
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

