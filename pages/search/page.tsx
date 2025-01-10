'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PostCard from '../../components/PostCard'

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/search?q=${searchTerm}`)
    const data = await res.json()
    setSearchResults(data)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Posts</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <div className="space-y-4">
        {searchResults.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

