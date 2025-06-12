"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, Share2, Users, Search, Filter, Plus } from "lucide-react"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community</h2>
          <p className="text-muted-foreground">Connect with other farmers and customers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search community..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Create Post Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Share updates, questions, or insights with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea placeholder="What's on your mind?" className="mb-2" />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        Tag People
                      </Button>
                    </div>
                    <Button size="sm">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          {[
            {
              id: 1,
              author: {
                name: "John Doe",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Farmer",
              },
              content:
                "Just harvested my first batch of organic tomatoes for the season! The yield is better than expected despite the dry weather we've been having. Anyone else experiencing good harvests this season?",
              image: "/placeholder.svg?height=300&width=600",
              likes: 24,
              comments: 8,
              shares: 3,
              time: "2 hours ago",
              tags: ["harvest", "organic", "tomatoes"],
            },
            {
              id: 2,
              author: {
                name: "Sarah Johnson",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Agricultural Expert",
              },
              content:
                "I'm hosting a workshop on sustainable farming practices next weekend. We'll cover water conservation, organic pest control, and soil health. Everyone is welcome to join! Location: Community Center, 10 AM - 2 PM.",
              likes: 42,
              comments: 15,
              shares: 12,
              time: "5 hours ago",
              tags: ["workshop", "sustainable", "farming"],
            },
            {
              id: 3,
              author: {
                name: "Michael Chen",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Customer",
              },
              content:
                "Looking for recommendations on the best varieties of maize to purchase this season. I've heard good things about the new drought-resistant hybrids. Has anyone tried them yet?",
              likes: 18,
              comments: 23,
              shares: 5,
              time: "1 day ago",
              tags: ["maize", "seeds", "farming"],
            },
          ].map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{post.author.name}</CardTitle>
                      <Badge variant="outline">{post.author.role}</Badge>
                    </div>
                    <CardDescription>{post.time}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{post.content}</p>
                {post.image && (
                  <div className="rounded-md overflow-hidden">
                    <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    {post.shares}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Sustainable Farming Practices",
                members: 245,
                posts: 120,
                image: "/placeholder.svg?height=100&width=100",
                joined: true,
              },
              {
                id: 2,
                name: "Organic Crop Growers",
                members: 189,
                posts: 87,
                image: "/placeholder.svg?height=100&width=100",
                joined: true,
              },
              {
                id: 3,
                name: "Agricultural Technology",
                members: 312,
                posts: 156,
                image: "/placeholder.svg?height=100&width=100",
                joined: false,
              },
              {
                id: 4,
                name: "Market Trends & Prices",
                members: 423,
                posts: 210,
                image: "/placeholder.svg?height=100&width=100",
                joined: true,
              },
              {
                id: 5,
                name: "Irrigation Systems",
                members: 178,
                posts: 65,
                image: "/placeholder.svg?height=100&width=100",
                joined: false,
              },
            ].map((group) => (
              <Card key={group.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <CardDescription>{group.members} members</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{group.posts} posts</span>
                    <Badge variant={group.joined ? "secondary" : "outline"}>
                      {group.joined ? "Joined" : "Not Joined"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={group.joined ? "outline" : "default"} className="w-full">
                    {group.joined ? "View Group" : "Join Group"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: "Sustainable Farming Workshop",
                date: "May 15, 2023",
                time: "10:00 AM - 2:00 PM",
                location: "Community Center",
                attendees: 45,
                image: "/placeholder.svg?height=150&width=300",
                attending: true,
              },
              {
                id: 2,
                title: "Agricultural Tech Expo",
                date: "May 22-24, 2023",
                time: "9:00 AM - 5:00 PM",
                location: "Convention Center",
                attendees: 230,
                image: "/placeholder.svg?height=150&width=300",
                attending: false,
              },
              {
                id: 3,
                title: "Farmers Market Day",
                date: "Every Saturday",
                time: "8:00 AM - 1:00 PM",
                location: "Town Square",
                attendees: 120,
                image: "/placeholder.svg?height=150&width=300",
                attending: true,
              },
            ].map((event) => (
              <Card key={event.id}>
                <div className="aspect-video relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${event.attending ? "bg-green-500" : "bg-muted"}`}>
                    {event.attending ? "Attending" : "Not Attending"}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {event.date} • {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.attendees} attending</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={event.attending ? "outline" : "default"} className="w-full">
                    {event.attending ? "View Details" : "RSVP"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                id: 1,
                title: "Farming Equipment Exchange",
                description: "Buy, sell, or trade farming equipment with other community members",
                members: 156,
                listings: 48,
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                id: 2,
                title: "Seed Exchange",
                description: "Exchange seeds and seedlings with fellow farmers",
                members: 203,
                listings: 75,
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                id: 3,
                title: "Local Produce Direct",
                description: "Connect directly with local customers for your produce",
                members: 312,
                listings: 124,
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((marketplace) => (
              <Card key={marketplace.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img
                        src={marketplace.image || "/placeholder.svg"}
                        alt={marketplace.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-base">{marketplace.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{marketplace.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>{marketplace.members} members</span>
                    <span>{marketplace.listings} listings</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Marketplace</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
