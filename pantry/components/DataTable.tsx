"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PenIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { supabaseClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
export default function DataTable({ searchQuery }: { searchQuery: string }) {
  const { user, isSignedIn } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  interface PantryItem {
    id: number;
    name: string;
    quantity: number;
    user_id: string;
    expiration: string | null;
  }

  const [data, setData] = useState<PantryItem[]>([]);

  const fetchItems = async () => {
    if (isSignedIn) {
      const { data, error } = await supabaseClient
        .from("PantryItems")
        .select("*")
        .eq("user_id", user?.id);
      if (error) {
        console.error(error);
      } else {
        setData(data);
      }
    }
  };
  const handleEdit = (item: PantryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: PantryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      const { error } = await supabaseClient
        .from("PantryItems")
        .delete()
        .eq("id", selectedItem.id);
      if (error) {
        console.error(error);
      } else {
        setData(data.filter((item) => item.id !== selectedItem.id));
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

  const saveEdit = async () => {
    if (selectedItem) {
      // Ensure expiration is either a valid date or null
      const updatedItem = {
        ...selectedItem,
        expiration:
          selectedItem.expiration === "" ? null : selectedItem.expiration,
      };

      const { error } = await supabaseClient
        .from("PantryItems")
        .update(updatedItem)
        .eq("id", selectedItem.id);

      if (error) {
        console.error(error);
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === selectedItem.id ? updatedItem : item
          )
        );
        setIsEditModalOpen(false);
        setSelectedItem(null);
      }
    }
  };
  useEffect(() => {
    fetchItems();
  }, [isSignedIn, data, user]);

  useEffect(() => {
    if (!isSignedIn) {
      setData([]);
    }
  }, [isSignedIn]);

  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="container mx-auto px-4 py-10 ">
      <div className=" p-6 rounded-lg shadow-lg shadow-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">Item</TableHead>
              <TableHead className="px-5">Quantity</TableHead>
              <TableHead className="px-5">Expiration Date</TableHead>
              <TableHead className="px-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="px-4">{item.quantity}</div>
                </TableCell>
                <TableCell className="px-4">{item.expiration}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <PenIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isEditModalOpen && selectedItem && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <DialogDescription>Edit</DialogDescription>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                />
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={selectedItem.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      setSelectedItem({
                        ...selectedItem,
                        quantity: value,
                      });
                    }
                  }}
                />

                <>
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <Input
                    id="expiration"
                    value={selectedItem.expiration || ""}
                    placeholder="YYYY-MM-DD"
                    type="date"
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        expiration: e.target.value,
                      })
                    }
                  />
                </>
              </div>
              <DialogFooter>
                <Button onClick={saveEdit}>Save</Button>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {isDeleteModalOpen && selectedItem && (
          <AlertDialog
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this item?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="ghost">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={confirmDelete}>Delete</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
