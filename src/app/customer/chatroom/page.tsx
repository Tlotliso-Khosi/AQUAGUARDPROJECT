"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Send, Paperclip, MoreVertical, Phone, Video, Users } from "lucide-react"

// Mock data for chats
const mockChats = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Do you have any tomatoes available?",
    time: "10:30 AM",
    unread: 2,
    online: true,
    type: "individual",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll bring the seeds tomorrow",
    time: "Yesterday",
    unread: 0,
    online: false,
    type: "individual",
  },
  {
    id: 3,
    name: "Sustainable Farming Group",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Michael: Has anyone tried the new irrigation system?",
    time: "Yesterday",
    unread: 5,
    online: true,
    members: 15,
    type: "group",
  },
  {
    id: 4,
    name: "Market Updates",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Lisa: Prices for maize have increased by 5%",
    time: "2 days ago",
    unread: 0,
    online: false,
    members: 28,
    type: "group",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the information!",
    time: "3 days ago",
    unread: 0,
    online: true,
    type: "individual",
  },
]

// Mock messages for a selected chat
const mockMessages = [
  {
    id: 1,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Hello! I'm interested in buying some of your produce.",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Hi John! What specifically are you looking for?",
    time: "10:17 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Do you have any tomatoes available? I need about 5kg for my restaurant.",
    time: "10:20 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: {
      id: 2,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Yes, I have fresh organic tomatoes available. I can provide 5kg at $4.99 per kg. Would that work for you?",
    time: "10:25 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "That sounds perfect! When can I pick them up?",
    time: "10:28 AM",
    isMe: false,
  },
  {
    id: 6,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Or do you offer delivery services?",
    time: "10:30 AM",
    isMe: false,
  },
]

export default function ChatroomPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter chats based on search term
  const filteredChats = mockChats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    const newMessage = {
      id: messages.length + 1,
      sender: {
        id: 2,
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getSelectedChat = () => {
    return mockChats.find((chat) => chat.id === selectedChat)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chatroom</h2>
        <p className="text-muted-foreground">Connect and communicate with other users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Chat List */}
        <Card className="md:col-span-1">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Messages</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chats..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="direct" className="flex-1">
                  Direct
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">
                  Groups
                </TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="p-2">
                  {filteredChats.map((chat) => (
                    <div key={chat.id}>
                      <div
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                          selectedChat === chat.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{chat.name}</p>
                            <p className="text-xs text-muted-foreground">{chat.time}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            {chat.unread > 0 && <Badge className="ml-2">{chat.unread}</Badge>}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={getSelectedChat()?.avatar || "/placeholder.svg"}
                        alt={getSelectedChat()?.name}
                      />
                      <AvatarFallback>{getSelectedChat()?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{getSelectedChat()?.name}</CardTitle>
                      <CardDescription>
                        {getSelectedChat()?.online ? "Online" : "Offline"}
                        {getSelectedChat()?.type === "group" && ` • ${getSelectedChat()?.members} members`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    {getSelectedChat()?.type === "group" && (
                      <Button variant="ghost" size="icon">
                        <Users className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-430px)] p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-2 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
                          {!msg.isMe && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                              <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={message.trim() === ""}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
                <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
