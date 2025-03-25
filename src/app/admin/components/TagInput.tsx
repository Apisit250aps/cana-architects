import React, { useState } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

const TagInput = ({ 
  value, 
  onChange 
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        const newTag = inputValue.trim()
        if (!value.includes(newTag)) {
          onChange([...value, newTag])
        }
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Tags</span>
      </label>
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg">
        {value.map((tag, index) => (
          <div key={index} className="badge badge-primary badge-outline gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(index)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[100px] outline-none bg-transparent"
          placeholder={value.length === 0 ? "Type and press Enter to add tags" : ""}
        />
      </div>
    </div>
  )
}

export default TagInput