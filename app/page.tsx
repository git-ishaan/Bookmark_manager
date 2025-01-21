"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, Bookmark, ChevronRight, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import {
  initDB,
  createFolder,
  getFolders,
  deleteFolder,
  createBookmark,
  getBookmarksByFolder,
  deleteBookmark,
} from "@/lib/db";

interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

interface Bookmark {
  id: string;
  folderId: string;
  title: string;
  url: string;
  description: string;
  createdAt: number;
}

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      const folderList = await getFolders();
      setFolders(folderList);
    };
    setup();
  }, []);

  const handleCreateFolder = async () => {
    try {
      const folder = await createFolder(newFolderName);
      setFolders([...folders, folder]);
      setNewFolderName("");
      setIsDialogOpen(false);
      toast.success("Folder created successfully!");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleCreateBookmark = async () => {
    if (!currentFolder) return;
    try {
      const url = newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`;
      const bookmark = await createBookmark({
        ...newBookmark,
        url,
        folderId: currentFolder.id,
      });
      setBookmarks([...bookmarks, bookmark]);
      setNewBookmark({ title: "", url: "", description: "" });
      setIsDialogOpen(false);
      toast.success("Bookmark created successfully!");
    } catch (error) {
      toast.error("Failed to create bookmark");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      setFolders(folders.filter((f) => f.id !== folderId));
      if (currentFolder?.id === folderId) {
        setCurrentFolder(null);
        setBookmarks([]);
      }
      toast.success("Folder deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete folder. Make sure it's empty first!");
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await deleteBookmark(bookmarkId);
      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      toast.success("Bookmark deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete bookmark");
    }
  };

  const handleFolderClick = async (folder: Folder) => {
    setCurrentFolder(folder);
    const folderBookmarks = await getBookmarksByFolder(folder.id);
    setBookmarks(folderBookmarks);
  };

  const handleBookmarkClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  const getPreviewUrl = (url: string) => {
    try {
      const urlObject = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://api.microlink.io?url=${encodeURIComponent(urlObject.href)}&screenshot=true&meta=false&embed=screenshot.url`;
    } catch {
      return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <nav className="bg-white shadow-sm mb-6 p-4 rounded-lg">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => setCurrentFolder(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentFolder && (
            <BreadcrumbItem>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
              <BreadcrumbLink className="text-gray-600">
                {currentFolder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      </nav>

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {currentFolder ? currentFolder.name : "My Bookmarks"}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {currentFolder ? "Add Bookmark" : "New Folder"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentFolder ? "Create New Bookmark" : "Create New Folder"}
              </DialogTitle>
            </DialogHeader>
            {currentFolder ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBookmark.title}
                    onChange={(e) =>
                      setNewBookmark({ ...newBookmark, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newBookmark.url}
                    onChange={(e) =>
                      setNewBookmark({ ...newBookmark, url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBookmark.description}
                    onChange={(e) =>
                      setNewBookmark({ ...newBookmark, description: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleCreateBookmark}>Create Bookmark</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {!currentFolder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="aspect-square p-4 border rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col justify-center items-center cursor-pointer"
            >
              <div className="flex flex-col items-center justify-between h-full w-full">
                <div
                  className="flex-1 flex flex-col items-center justify-center w-full"
                  onClick={() => handleFolderClick(folder)}
                >
                  <Folder className="h-12 w-12 mb-2 text-blue-500" />
                  <span className="text-center font-medium">{folder.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="aspect-square p-4 border rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col cursor-pointer"
              onClick={(e) => handleBookmarkClick(bookmark.url, e)}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    {getFaviconUrl(bookmark.url) ? (
                      <img
                        src={getFaviconUrl(bookmark.url)!}
                        alt={`${bookmark.title} favicon`}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <Bookmark className="h-6 w-6 text-blue-500" />
                    )}
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="font-medium">{bookmark.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {bookmark.description}
                    </p>
                  </div>
                  <div className="relative aspect-video mb-3 bg-gray-100 rounded overflow-hidden">
                    {getPreviewUrl(bookmark.url) && (
                      <img
                        src={getPreviewUrl(bookmark.url)!}
                        alt={`Preview of ${bookmark.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-center"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bookmark opening when deleting
                    handleDeleteBookmark(bookmark.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
