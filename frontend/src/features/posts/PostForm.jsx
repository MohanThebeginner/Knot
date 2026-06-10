import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/utils/cn'

const MAX_IMAGE_MB = 10
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function PostForm({
  initialValues = { title: '', content: '' },
  existingImage = null,
  onSubmit,
  loading,
  submitLabel = 'Publish',
  onCancel,
}) {
  const [fields, setFields]     = useState(initialValues)
  const [errors, setErrors]     = useState({})
  const [image,  setImage]      = useState(null)        // File object
  const [preview, setPreview]   = useState(existingImage) // URL string
  const [imageError, setImageError] = useState('')
  const fileRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError('Only JPEG, PNG, WebP, or GIF images are allowed.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`)
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImage(null)
    setPreview(null)
    setImageError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function validate() {
    const errs = {}
    if (!fields.title.trim())          errs.title   = 'Title is required'
    if (fields.content.trim().length < 10) errs.content = 'Content is too short (min 10 characters)'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await onSubmit({
      title:   fields.title.trim(),
      content: fields.content.trim(),
      image,   // File | null
    })
  }

  const charCount = fields.content.length

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      <Input
        label="Title"
        name="title"
        type="text"
        placeholder="What's this about?"
        value={fields.title}
        onChange={handleChange}
        error={errors.title}
        required
        autoFocus
      />

      <Textarea
        label="Content"
        name="content"
        placeholder="Share your thoughts…"
        value={fields.content}
        onChange={handleChange}
        error={errors.content}
        rows={8}
        required
      />

      {/* Character count */}
      <div className="flex justify-end -mt-3">
        <span className={cn(
          'text-xs tabular-nums transition-colors',
          charCount < 10 ? 'text-error' : 'text-text-secondary'
        )}>
          {charCount} characters
        </span>
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">
          Image <span className="text-text-secondary font-normal">(optional)</span>
        </label>

        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-lg overflow-hidden border border-border"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Remove image"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M3 3l7 7M10 3l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 h-28 rounded-lg border-2 border-dashed border-border',
              'text-text-secondary hover:text-text-primary hover:border-accent/50 hover:bg-surface-2/50',
              'transition-colors duration-150 cursor-pointer'
            )}
          >
            <UploadIcon />
            <span className="text-sm">Click to upload image</span>
            <span className="text-xs text-text-secondary">
              JPEG, PNG, WebP, GIF · max {MAX_IMAGE_MB}MB
            </span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
        />

        {imageError && (
          <p className="text-xs text-error">{imageError}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1 border-t border-border">
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
